'use client';

import React, { useState, useEffect, useTransition } from 'react';
import DashboardDateFilter from '@/components/DashboardDateFilter';
import type { HostingAccount } from '@/lib/hostingUtils';
import type { ExpenseRecord } from '@/lib/expenseUtils';
import { createManualSale } from '@/app/actions/sales';
import { useRouter } from 'next/navigation';

export interface SaleRecord {
  id: string;
  order_number: number | string;
  date: string;
  status: string;
  customer: string;
  customer_type?: string;
  customer_email?: string;
  products?: string;
  items_sold?: number;
  coupons?: string;
  net_sales: number;
  attribution?: string;
  stripe_reference?: string;
  manual_entry?: boolean;
  notes?: string;
}

interface SalesManagementProps {
  sales: SaleRecord[];
  allSalesCount: number;
  period: string;
  startDate?: string;
  endDate?: string;
  hostings: HostingAccount[];
  expenses?: ExpenseRecord[];
}

export default function SalesManagement({
  sales,
  allSalesCount,
  period,
  startDate,
  endDate,
  hostings,
  expenses = [],
}: SalesManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const handleOpen = () => setIsRecordModalOpen(true);
    window.addEventListener('open-record-payment-modal', handleOpen);
    return () => window.removeEventListener('open-record-payment-modal', handleOpen);
  }, []);

  // Form State for Manual Sale
  const todayStr = new Date().toISOString().split('T')[0];
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Zelle' | 'Bank Transfer' | 'Cash' | 'Check' | 'Other'>('Zelle');
  const [paymentDate, setPaymentDate] = useState(todayStr);
  const [products, setProducts] = useState('Website Development (Initial Payment)');
  const [itemsSold, setItemsSold] = useState('1');
  const [reference, setReference] = useState('');
  const [isHostingPayment, setIsHostingPayment] = useState(false);
  const [selectedHostingId, setSelectedHostingId] = useState('');
  const [autoRenewHosting, setAutoRenewHosting] = useState(true);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Metrics
  const totalRevenue = sales.reduce((acc, sale) => acc + (parseFloat(String(sale.net_sales)) || 0), 0);
  const totalOrders = sales.length;
  const totalItemsSold = sales.reduce((acc, sale) => acc + (parseInt(String(sale.items_sold), 10) || 0), 0);
  const totalExpenses = (expenses || []).reduce((acc, exp) => acc + (parseFloat(String(exp.amount)) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const resetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setAmount('');
    setPaymentMethod('Zelle');
    setPaymentDate(todayStr);
    setProducts('Website Development (Initial Payment)');
    setItemsSold('1');
    setReference('');
    setIsHostingPayment(false);
    setSelectedHostingId('');
    setAutoRenewHosting(true);
  };

  const handleSubmitManualSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showFeedback('error', 'Please enter a customer name.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showFeedback('error', 'Please enter a valid amount.');
      return;
    }

    startTransition(async () => {
      const res = await createManualSale({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        amount: numAmount,
        paymentMethod,
        paymentDate,
        products: products.trim(),
        itemsSold: parseInt(itemsSold, 10) || 1,
        reference: reference.trim() || `${paymentMethod} Payment`,
        hostingId: isHostingPayment && selectedHostingId ? selectedHostingId : undefined,
        autoRenewHosting: isHostingPayment && autoRenewHosting,
      });

      if (res.success) {
        showFeedback('success', `Manual payment of $${numAmount.toFixed(2)} recorded successfully (Order #${res.orderNumber})!`);
        setIsRecordModalOpen(false);
        resetForm();
        router.refresh();
      } else {
        showFeedback('error', res.error || 'Failed to record payment.');
      }
    });
  };

  const getAttributionBadge = (sale: SaleRecord) => {
    const attr = sale.attribution?.toLowerCase() || '';
    if (attr.includes('zelle')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
          Zelle
        </span>
      );
    }
    if (attr.includes('bank') || attr.includes('wire') || attr.includes('transfer')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          Bank Transfer
        </span>
      );
    }
    if (attr.includes('cash')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Cash
        </span>
      );
    }
    if (attr.includes('hosting renewal')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Hosting Renewal
        </span>
      );
    }
    if (attr.includes('manual invoice')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Manual Invoice
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
        {sale.attribution || 'Direct'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform animate-in fade-in slide-in-from-top-4 duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Date Filter Bar */}
      <div>
        <DashboardDateFilter />
      </div>

      {/* Filter Status Badge */}
      {period !== 'all' && (
        <div className="flex items-center justify-between text-xs text-gray-500 bg-orange-50/50 border border-orange-100 px-3.5 py-2.5 rounded-xl shadow-2xs">
          <span>
            Showing <strong className="text-gray-900">{sales.length}</strong> of{' '}
            <strong className="text-gray-900">{allSalesCount}</strong> total records for timeframe filter:{' '}
            <span className="font-semibold text-orange-600 uppercase">{period.replace('_', ' ')}</span>
          </span>
          {startDate && endDate && (
            <span>
              Range: {startDate} to {endDate}
            </span>
          )}
        </div>
      )}

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</p>
            <span className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Stripe + Zelle + Manual payments</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Expenses</p>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2 truncate">
            ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">{(expenses || []).length} registered expenses in period</p>
        </div>

        {/* Net Profit: Revenue - Gastos */}
        <div className={`rounded-xl shadow-xs p-5 sm:p-6 border transition-all ${
          netProfit >= 0
            ? 'bg-gradient-to-br from-white via-white to-emerald-50/50 border-emerald-200/80'
            : 'bg-gradient-to-br from-white via-white to-rose-50/50 border-rose-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Net Profit</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">(Revenue - Gastos)</span>
            </div>
            <span className={`p-2 rounded-lg ${
              netProfit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {netProfit >= 0 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
            </span>
          </div>
          <p className={`text-2xl sm:text-3xl font-extrabold mt-2 truncate ${
            netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {netProfit < 0 ? '-' : ''}${Math.abs(netProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="text-slate-500 font-medium">
              {totalRevenue > 0 ? `${profitMargin.toFixed(1)}% margin` : 'Revenue menos gastos'}
            </span>
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
              netProfit >= 0 ? 'bg-emerald-100/70 text-emerald-800' : 'bg-rose-100/70 text-rose-800'
            }`}>
              {netProfit >= 0 ? 'Positive Margin' : 'Deficit'}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</p>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">{totalOrders}</p>
          <p className="text-xs text-slate-400 mt-1">{totalItemsSold} items sold in total</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Transaction History</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live unified stream of Stripe webhooks & offline payments</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {sales.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/75">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Order #
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">
                  Product(s)
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Items Sold
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Net Sales
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Attribution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-500">
                    {allSalesCount === 0
                      ? 'No sales found in Firestore yet.'
                      : 'No sales records match the selected date filter.'}
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {sale.date
                        ? new Date(sale.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      #{sale.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sale.status?.toLowerCase() === 'completed' || sale.status?.toLowerCase() === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sale.status?.toLowerCase() === 'processing' || sale.status?.toLowerCase() === 'open'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      <div>{sale.customer}</div>
                      {sale.customer_email && (
                        <div className="text-xs text-slate-400 font-normal">{sale.customer_email}</div>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 text-xs text-slate-600 max-w-[250px] truncate"
                      title={sale.products || ''}
                    >
                      {sale.products || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-900">
                      {sale.items_sold || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">
                      ${parseFloat(String(sale.net_sales || 0)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getAttributionBadge(sale)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Manual Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-amber-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Record Offline Payment</h3>
                  <p className="text-xs text-gray-500">Post Zelle, cash, or direct wire transactions into sales</p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitManualSale} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Zelle', 'Bank Transfer', 'Cash', 'Check', 'Other'] as const).map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? method === 'Zelle'
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-orange-500 text-white border-orange-500 shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
                {paymentMethod === 'Zelle' && (
                  <p className="text-[11px] text-purple-600 mt-1.5 flex items-center gap-1 font-medium">
                    <span>⚡</span> Instant bank-to-bank transfer via Zelle
                  </p>
                )}
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount Received (USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-base font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Payment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Customer / Business Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp / John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Product / Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product / Service Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Development (Final Payment)"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                />
                {/* Quick chip suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'Website Development (Initial Payment)',
                    'Website Development (Final Payment)',
                    'Annual Webhosting Renewal',
                    'Custom Feature Development',
                    'SEO & Digital Marketing',
                  ].map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      onClick={() => setProducts(chip)}
                      className="text-[11px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference / Memo */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reference / Memo / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Zelle Confirmation #982341 or invoice note"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                />
              </div>

              {/* Optional Hosting Link */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="isHostingPayment" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Is this payment for a client&apos;s Web Hosting?
                  </label>
                  <input
                    type="checkbox"
                    id="isHostingPayment"
                    checked={isHostingPayment}
                    onChange={(e) => setIsHostingPayment(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 border-gray-300 cursor-pointer"
                  />
                </div>

                {isHostingPayment && (
                  <div className="space-y-3 pt-2 border-t border-slate-200 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Select Hosting Account
                      </label>
                      <select
                        value={selectedHostingId}
                        onChange={(e) => setSelectedHostingId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900"
                      >
                        <option value="">-- Choose account to credit --</option>
                        {hostings.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.customerName} ({h.domain}) — Current renewal: {h.renewalDate}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoRenewHosting"
                        checked={autoRenewHosting}
                        onChange={(e) => setAutoRenewHosting(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded-md focus:ring-orange-500 border-gray-300 cursor-pointer"
                      />
                      <label htmlFor="autoRenewHosting" className="text-xs text-slate-600 cursor-pointer">
                        Auto-advance this client&apos;s hosting renewal date by +1 year
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Post Payment</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
