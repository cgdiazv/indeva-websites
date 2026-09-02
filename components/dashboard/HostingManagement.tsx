'use client';

import React, { useState, useTransition } from 'react';
import type { HostingAccount } from '@/lib/hostingUtils';
import { 
  createHostingAccount, 
  updateHostingAccount, 
  deleteHostingAccount, 
  quickRenewHosting,
  seedHostingsFromHistoricalSales,
  generateRenewalPaymentLink,
  sendRenewalReminderEmail,
  runAutomatedRenewalScan
} from '@/app/actions/hostings';

interface HostingManagementProps {
  initialHostings: HostingAccount[];
}

export default function HostingManagement({ initialHostings }: HostingManagementProps) {
  const [hostings, setHostings] = useState<HostingAccount[]>(initialHostings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_renewal' | 'overdue' | 'active' | 'suspended'>('all');
  
  type SortField = 'customerName' | 'planName' | 'amount' | 'renewalDate' | 'status' | 'notes';
  type SortDirection = 'asc' | 'desc';

  const [sortField, setSortField] = useState<SortField>('renewalDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHosting, setEditingHosting] = useState<HostingAccount | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [emailModalHosting, setEmailModalHosting] = useState<HostingAccount | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [scanResultsModal, setScanResultsModal] = useState<any | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    const isActive = sortField === field;
    return (
      <span className={`inline-flex flex-col ml-1.5 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-300 group-hover:text-gray-500'}`}>
        <svg
          className={`w-2.5 h-2.5 -mb-0.5 transition-opacity ${isActive && sortDirection === 'asc' ? 'text-orange-600 opacity-100 font-bold' : 'opacity-40'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 4l-7 7h14z" />
        </svg>
        <svg
          className={`w-2.5 h-2.5 -mt-0.5 transition-opacity ${isActive && sortDirection === 'desc' ? 'text-orange-600 opacity-100 font-bold' : 'opacity-40'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 20l7-7H5z" />
        </svg>
      </span>
    );
  };

  // Helper to show transient alerts
  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Compute Renewal Metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysRemaining = (renewalDateStr: string) => {
    const renewalDate = new Date(renewalDateStr);
    renewalDate.setHours(0, 0, 0, 0);
    const diffTime = renewalDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const activeHostings = hostings.filter(h => h.status !== 'suspended' && h.status !== 'cancelled');
  const overdueCount = hostings.filter(h => {
    const days = getDaysRemaining(h.renewalDate);
    return days < 0 && h.status !== 'suspended' && h.status !== 'cancelled';
  }).length;

  const dueSoonCount = hostings.filter(h => {
    const days = getDaysRemaining(h.renewalDate);
    return days >= 0 && days <= 30 && h.status !== 'suspended' && h.status !== 'cancelled';
  }).length;

  const totalARR = hostings.reduce((sum, h) => {
    if (h.status === 'suspended' || h.status === 'cancelled') return sum;
    const multiplier = h.billingCycle === 'monthly' ? 12 : h.billingCycle === 'biannual' ? 2 : 1;
    return sum + (h.amount * multiplier);
  }, 0);

  // Filter & Sort Logic
  const filteredHostings = hostings
    .filter(item => {
      const days = getDaysRemaining(item.renewalDate);
      // Status filter
      if (statusFilter === 'overdue') {
        if (days >= 0 || item.status === 'suspended') return false;
      } else if (statusFilter === 'pending_renewal') {
        if (days < 0 || days > 30 || item.status === 'suspended') return false;
      } else if (statusFilter === 'active') {
        if (days < 0 || item.status === 'suspended') return false;
      } else if (statusFilter === 'suspended') {
        if (item.status !== 'suspended' && item.status !== 'cancelled') return false;
      }

      // Search query
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.customerName?.toLowerCase().includes(q) ||
        item.domain?.toLowerCase().includes(q) ||
        item.customerEmail?.toLowerCase().includes(q) ||
        item.planName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'renewalDate') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (sortField === 'amount') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Handlers
  const handleQuickRenew = (id: string, customerName: string) => {
    if (!confirm(`Mark hosting for "${customerName}" as renewed for +1 year?`)) return;
    
    startTransition(async () => {
      const res = await quickRenewHosting(id, 1);
      if (res.success) {
        showFeedback('success', `Renewed ${customerName} until ${res.nextRenewal}`);
        setHostings(prev => prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              renewalDate: res.nextRenewal!,
              status: 'active',
            };
          }
          return item;
        }));
      } else {
        showFeedback('error', res.error || 'Failed to renew.');
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteHostingAccount(id);
      if (res.success) {
        showFeedback('success', 'Hosting account removed successfully.');
        setHostings(prev => prev.filter(h => h.id !== id));
        setDeletingId(null);
      } else {
        showFeedback('error', res.error || 'Failed to delete account.');
      }
    });
  };

  const handleCopyLink = async (hosting: HostingAccount) => {
    setCopyingId(hosting.id);
    try {
      const res = await generateRenewalPaymentLink(hosting.id);
      if (res.success && res.url) {
        await navigator.clipboard.writeText(res.url);
        showFeedback('success', `Stripe payment link for ${hosting.domain} ($${hosting.amount.toFixed(2)}) copied to clipboard!`);
      } else {
        showFeedback('error', res.error || 'Failed to generate Stripe payment link.');
      }
    } catch (err: any) {
      showFeedback('error', 'Could not copy link to clipboard.');
    } finally {
      setCopyingId(null);
    }
  };

  const handleSendReminderSubmit = (hostingId: string, customMessage: string) => {
    startTransition(async () => {
      const res = await sendRenewalReminderEmail(hostingId, customMessage);
      if (res.success) {
        showFeedback('success', `Renewal reminder email sent successfully to ${emailModalHosting?.customerEmail || 'customer'}!`);
        setEmailModalHosting(null);
        setHostings(prev => prev.map(item => {
          if (item.id === hostingId) {
            return {
              ...item,
              lastReminderSentAt: res.sentAt!,
            };
          }
          return item;
        }));
      } else {
        showFeedback('error', res.error || 'Failed to send reminder email.');
      }
    });
  };

  const handleImportSales = () => {
    if (!confirm('Scan historical sales data and import all hosting subscriptions? Existing domains will not be duplicated.')) return;

    startTransition(async () => {
      const res = await seedHostingsFromHistoricalSales();
      if (res.success) {
        showFeedback('success', `Imported ${res.addedCount} customer hosting accounts from sales.`);
        window.location.reload();
      } else {
        showFeedback('error', res.error || 'Failed to import sales data.');
      }
    });
  };

  const handleRunAutoScan = () => {
    if (!confirm('Run automated scan now? This will evaluate all accounts and send renewal reminder emails to customers whose hosting is expiring in 30, 14, 7, <=3, or <=0 days (with a 48h anti-spam cooldown).')) return;

    startTransition(async () => {
      const res = await runAutomatedRenewalScan();
      if (res.success) {
        setScanResultsModal(res);
      } else {
        showFeedback('error', res.error || 'Failed to execute automated scan.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Flash Alert */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm transition-all ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Accounts</p>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">{activeHostings.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total managed client domains</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Due Soon (30d)</p>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{dueSoonCount}</p>
          <p className="text-xs text-gray-500 mt-1">Renewals due this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">Overdue</p>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">{overdueCount}</p>
          <p className="text-xs text-gray-500 mt-1">Expired without confirmed renewal</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Annual Run-rate (ARR)</p>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">${totalARR.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Hosting recurring subscription value</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, and Action Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search customer, domain, plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRunAutoScan}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200/80 transition-colors disabled:opacity-50 shadow-sm"
              title="Run automated scan and email customers whose renewal is approaching (with 48h cooldown)"
            >
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Auto-Reminders Scan
            </button>

            <button
              onClick={handleImportSales}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors disabled:opacity-50"
              title="Auto-import past customer hosting purchases from sales database"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import From Sales
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Hosting Account
            </button>
          </div>
        </div>

        {/* Filter Pills & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({hostings.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_renewal')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                statusFilter === 'pending_renewal'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Due Soon ({dueSoonCount})
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                statusFilter === 'overdue'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Overdue ({overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Active ({activeHostings.length - dueSoonCount - overdueCount})
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                statusFilter === 'suspended'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Suspended / Cancelled
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Sort by:</span>
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('-') as [SortField, SortDirection];
                setSortField(field);
                setSortDirection(dir);
              }}
              className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="renewalDate-asc">Renewal Date (Earliest first)</option>
              <option value="renewalDate-desc">Renewal Date (Latest first)</option>
              <option value="customerName-asc">Customer Name (A-Z)</option>
              <option value="customerName-desc">Customer Name (Z-A)</option>
              <option value="amount-desc">Price (High to Low)</option>
              <option value="amount-asc">Price (Low to High)</option>
              <option value="status-asc">Status (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hosting Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50/75 select-none">
              <tr>
                <th
                  onClick={() => handleSort('customerName')}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  title="Click to sort by Customer & Domain"
                >
                  <div className="flex items-center gap-1">
                    <span>Customer & Domain</span>
                    {renderSortIcon('customerName')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  title="Click to sort by Plan & Price"
                >
                  <div className="flex items-center gap-1">
                    <span>Plan & Price</span>
                    {renderSortIcon('amount')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('renewalDate')}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  title="Click to sort by Renewal Date"
                >
                  <div className="flex items-center gap-1">
                    <span>Renewal Date</span>
                    {renderSortIcon('renewalDate')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  title="Click to sort by Status"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    {renderSortIcon('status')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('notes')}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group"
                  title="Click to sort by Notes"
                >
                  <div className="flex items-center gap-1">
                    <span>Notes</span>
                    {renderSortIcon('notes')}
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHostings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900">No hosting accounts found</p>
                      <p className="text-xs text-gray-500">
                        {hostings.length === 0 
                          ? 'Add your first hosting account or import existing clients from your sales records.' 
                          : 'Try adjusting your search query or filters.'}
                      </p>
                      {hostings.length === 0 && (
                        <div className="flex justify-center gap-2 pt-2">
                          <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-3.5 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600"
                          >
                            + Add Account
                          </button>
                          <button
                            onClick={handleImportSales}
                            className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 border border-gray-200"
                          >
                            Import From Sales
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHostings.map((hosting) => {
                  const days = getDaysRemaining(hosting.renewalDate);
                  const isOverdue = days < 0;
                  const isDueSoon = days >= 0 && days <= 30;

                  return (
                    <tr key={hosting.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Customer & Domain */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{hosting.customerName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a 
                            href={`https://${hosting.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                          >
                            {hosting.domain}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                        {hosting.customerEmail && (
                          <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{hosting.customerEmail}</div>
                        )}
                        {hosting.lastReminderSentAt && (
                          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-0.5 w-fit font-medium flex items-center gap-1 mt-1.5">
                            <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>Emailed {new Date(hosting.lastReminderSentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                      </td>

                      {/* Plan & Price */}
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{hosting.planName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          <span className="font-bold text-gray-800">${hosting.amount.toFixed(2)}</span>
                          <span className="text-gray-400 capitalize"> / {hosting.billingCycle}</span>
                        </div>
                      </td>

                      {/* Renewal Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {new Date(hosting.renewalDate + 'T00:00:00').toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs mt-0.5">
                          {hosting.status === 'suspended' || hosting.status === 'cancelled' ? (
                            <span className="text-gray-400">Suspended</span>
                          ) : isOverdue ? (
                            <span className="text-rose-600 font-semibold">{Math.abs(days)} days overdue</span>
                          ) : isDueSoon ? (
                            <span className="text-amber-600 font-semibold">{days === 0 ? 'Due Today' : `In ${days} days`}</span>
                          ) : (
                            <span className="text-emerald-600">In {days} days</span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hosting.status === 'suspended' || hosting.status === 'cancelled' ? (
                          <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                            {hosting.status}
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-rose-100 text-rose-800 animate-pulse">
                            Overdue
                          </span>
                        ) : isDueSoon ? (
                          <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            Expiring Soon
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-4 max-w-[200px]">
                        <p className="text-xs text-gray-500 truncate" title={hosting.notes || ''}>
                          {hosting.notes || '-'}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1.5">
                        {/* Send Email Reminder Button */}
                        <button
                          onClick={() => setEmailModalHosting(hosting)}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md border border-amber-200 transition-colors inline-flex items-center gap-1 font-semibold"
                          title={`Send custom payment reminder email to ${hosting.customerEmail || 'customer'}`}
                        >
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </button>

                        {/* Copy Stripe Payment Link Button */}
                        <button
                          onClick={() => handleCopyLink(hosting)}
                          disabled={copyingId === hosting.id}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors inline-flex items-center gap-1 font-semibold disabled:opacity-50"
                          title="Generate & copy custom Stripe checkout link"
                        >
                          {copyingId === hosting.id ? (
                            <span className="animate-spin text-[10px]">⏳</span>
                          ) : (
                            <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          )}
                          Copy Link
                        </button>

                        {/* Quick Renew +1y Button */}
                        <button
                          onClick={() => handleQuickRenew(hosting.id, hosting.customerName)}
                          disabled={isPending}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors inline-flex items-center gap-1 font-semibold disabled:opacity-50"
                          title="Manually advance renewal date by 1 year"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          +1y
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => setEditingHosting(hosting)}
                          className="px-2 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                          title="Edit details"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingId(hosting.id)}
                          className="px-1.5 py-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete account"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Hosting Modal */}
      {(isAddModalOpen || editingHosting) && (
        <HostingFormModal
          hosting={editingHosting}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingHosting(null);
          }}
          onSaved={(savedHosting) => {
            setIsAddModalOpen(false);
            setEditingHosting(null);
            showFeedback('success', editingHosting ? 'Hosting account updated.' : 'Hosting account created.');
            window.location.reload();
          }}
        />
      )}

      {/* Send Renewal Email Reminder Modal */}
      {emailModalHosting && (
        <SendReminderModal
          hosting={emailModalHosting}
          onClose={() => setEmailModalHosting(null)}
          onSend={(customMsg) => handleSendReminderSubmit(emailModalHosting.id, customMsg)}
          isPending={isPending}
        />
      )}

      {/* Auto-Reminders Scan Report Modal */}
      {scanResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Auto-Reminders Scan Completed</h3>
                  <p className="text-xs text-gray-500">
                    Scanned {scanResultsModal.processedCount} accounts • {scanResultsModal.sentCount} renewal email(s) sent
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setScanResultsModal(null);
                  window.location.reload();
                }} 
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto my-4 divide-y divide-gray-100 text-xs">
              {scanResultsModal.details?.map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-900">{item.customerName}</span>
                    <span className="text-gray-400 mx-1.5">•</span>
                    <span className="font-mono text-orange-600">{item.domain}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.message}</p>
                  </div>
                  <div>
                    {item.status === 'sent' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        SENT
                      </span>
                    ) : item.status === 'error' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        ERROR
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                        SKIPPED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setScanResultsModal(null);
                  window.location.reload();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Delete Hosting Account?</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to remove this hosting record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                {isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Add / Edit Modal Sub-component
 */
function HostingFormModal({
  hosting,
  onClose,
  onSaved,
}: {
  hosting: HostingAccount | null;
  onClose: () => void;
  onSaved: (account: any) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const defaultStartDate = hosting?.startDate || new Date().toISOString().split('T')[0];
  
  // Default renewal date 1 year from start date if creating
  const defaultRenewalDate = hosting?.renewalDate || (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  })();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let res;
      if (hosting) {
        res = await updateHostingAccount(hosting.id, formData);
      } else {
        res = await createHostingAccount(formData);
      }

      if (res.success) {
        onSaved(res);
      } else {
        setError(res.error || 'An error occurred.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {hosting ? 'Edit Hosting Account' : 'New Hosting Account'}
            </h3>
            <p className="text-xs text-gray-500">Track customer domain and renewal deadline</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg p-1">
            ✕
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Customer Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Customer / Business Name *</label>
            <input
              type="text"
              name="customerName"
              required
              defaultValue={hosting?.customerName || ''}
              placeholder="e.g. John Doe / Apex Agency"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Domain */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Website Domain *</label>
            <input
              type="text"
              name="domain"
              required
              defaultValue={hosting?.domain || ''}
              placeholder="e.g. clientwebsite.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                defaultValue={hosting?.customerEmail || ''}
                placeholder="client@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Customer Phone</label>
              <input
                type="tel"
                name="customerPhone"
                defaultValue={hosting?.customerPhone || ''}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Plan Name & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hosting Plan</label>
              <select
                name="planName"
                defaultValue={hosting?.planName || 'Webhosting Annual Subscription'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
              >
                <option value="Webhosting Annual Subscription">Webhosting Annual Subscription</option>
                <option value="Domain + Webhosting Annual Bundle">Domain + Webhosting Annual Bundle</option>
                <option value="The Growth Partner (Hosting Included)">The Growth Partner (Hosting Included)</option>
                <option value="Enterprise Managed Cloud Hosting">Enterprise Managed Cloud Hosting</option>
                <option value="Custom Plan">Custom Plan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Amount ($ USD)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                required
                defaultValue={hosting?.amount ?? 86.00}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Billing Cycle & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Billing Cycle</label>
              <select
                name="billingCycle"
                defaultValue={hosting?.billingCycle || 'annual'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
              >
                <option value="annual">Annual (Yearly)</option>
                <option value="monthly">Monthly</option>
                <option value="biannual">Biannual (Every 2 Years)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Status Override</label>
              <select
                name="status"
                defaultValue={hosting?.status || 'active'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
              >
                <option value="active">Active</option>
                <option value="pending_renewal">Expiring Soon</option>
                <option value="overdue">Overdue</option>
                <option value="suspended">Suspended / Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Start Date & Renewal Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                defaultValue={defaultStartDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Renewal Date *</label>
              <input
                type="date"
                name="renewalDate"
                required
                defaultValue={defaultRenewalDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium text-orange-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Internal Notes / Registrar Details</label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={hosting?.notes || ''}
              placeholder="e.g. Registered via Namecheap, DNS managed on Cloudflare, cPanel user..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {isPending ? 'Saving...' : hosting ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Send Renewal Reminder Email Modal Sub-component
 */
function SendReminderModal({
  hosting,
  onClose,
  onSend,
  isPending,
}: {
  hosting: HostingAccount;
  onClose: () => void;
  onSend: (customMsg: string) => void;
  isPending: boolean;
}) {
  const [customMessage, setCustomMessage] = useState('');
  const hasEmail = Boolean(hosting.customerEmail && hosting.customerEmail.includes('@'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasEmail) return;
    onSend(customMessage.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Send Renewal Reminder</h3>
              <p className="text-xs text-gray-500">Delivered via Resend with dynamic Stripe Checkout</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg p-1">
            ✕
          </button>
        </div>

        {!hasEmail ? (
          <div className="my-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            <p className="font-bold mb-1">Missing Recipient Email Address</p>
            <p>This customer does not have an email on file. Please edit this account to add their email before sending.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
            {/* Summary Details */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-semibold text-slate-800">{hosting.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Domain:</span>
                <span className="font-mono font-medium text-orange-600">{hosting.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renewal Due Date:</span>
                <span className="font-medium text-slate-800">
                  {new Date(hosting.renewalDate + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60 items-center">
                <span className="font-semibold text-slate-700">Custom Billed Amount:</span>
                <span className="font-extrabold text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ${hosting.amount.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Live Stripe Checkout Note */}
            <div className="p-3 bg-orange-50/70 border border-orange-200/70 rounded-xl flex items-start gap-2.5 text-orange-950">
              <span className="text-orange-500 text-sm mt-0.5">🔒</span>
              <p className="text-[11px] leading-relaxed">
                A custom Stripe Checkout payment link for <strong>${hosting.amount.toFixed(2)} USD</strong> will automatically be attached to the email. When the client pays, their hosting will auto-renew for +1 year.
              </p>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Optional Message / Note to Client <span className="text-gray-400 font-normal">(Included in email)</span>
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={2}
                placeholder="e.g. As discussed, we have applied your preferred custom rate for this cycle."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isPending ? (
                  <>
                    <span className="animate-spin text-xs">⏳</span>
                    <span>Sending Email via Resend...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reminder Email →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
