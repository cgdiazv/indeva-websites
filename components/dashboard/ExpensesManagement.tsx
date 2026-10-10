'use client';

import React, { useState, useEffect, useTransition } from 'react';
import DashboardDateFilter from '@/components/DashboardDateFilter';
import { useRouter } from 'next/navigation';
import { 
  type ExpenseRecord, 
  EXPENSE_CATEGORIES, 
  EXPENSE_PAYMENT_METHODS 
} from '@/lib/expenseUtils';
import { 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from '@/app/actions/expenses';

interface ExpensesManagementProps {
  expenses: ExpenseRecord[];
  allExpensesCount: number;
  period: string;
  startDate?: string;
  endDate?: string;
}

export default function ExpensesManagement({
  expenses,
  allExpensesCount,
  period,
  startDate,
  endDate,
}: ExpensesManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(todayStr);
  const [formVendor, setFormVendor] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState<string>(EXPENSE_PAYMENT_METHODS[0]);
  const [formReference, setFormReference] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Listen for event from DashboardLayout top header
  useEffect(() => {
    const handleOpen = () => {
      resetForm();
      setIsAddModalOpen(true);
    };
    window.addEventListener('open-record-expense-modal', handleOpen);
    return () => window.removeEventListener('open-record-expense-modal', handleOpen);
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory(EXPENSE_CATEGORIES[0]);
    setFormAmount('');
    setFormDate(todayStr);
    setFormVendor('');
    setFormPaymentMethod(EXPENSE_PAYMENT_METHODS[0]);
    setFormReference('');
    setFormNotes('');
  };

  const handleOpenEdit = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setFormTitle(expense.title);
    setFormCategory(expense.category || EXPENSE_CATEGORIES[0]);
    setFormAmount(String(expense.amount));
    // Parse date for input YYYY-MM-DD
    const dStr = expense.date ? expense.date.split('T')[0] : todayStr;
    setFormDate(dStr);
    setFormVendor(expense.vendor || '');
    setFormPaymentMethod(expense.paymentMethod || EXPENSE_PAYMENT_METHODS[0]);
    setFormReference(expense.reference || '');
    setFormNotes(expense.notes || '');
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showFeedback('error', 'Please enter an expense title / description.');
      return;
    }
    const numAmount = parseFloat(formAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showFeedback('error', 'Please enter a valid amount greater than $0.00.');
      return;
    }

    startTransition(async () => {
      if (editingExpense) {
        const res = await updateExpense(editingExpense.id, {
          title: formTitle.trim(),
          category: formCategory,
          amount: numAmount,
          date: formDate,
          vendor: formVendor.trim(),
          paymentMethod: formPaymentMethod,
          reference: formReference.trim(),
          notes: formNotes.trim(),
        });

        if (res.success) {
          showFeedback('success', `Expense updated successfully!`);
          setEditingExpense(null);
          resetForm();
          router.refresh();
        } else {
          showFeedback('error', res.error || 'Failed to update expense.');
        }
      } else {
        const res = await createExpense({
          title: formTitle.trim(),
          category: formCategory,
          amount: numAmount,
          date: formDate,
          vendor: formVendor.trim(),
          paymentMethod: formPaymentMethod,
          reference: formReference.trim(),
          notes: formNotes.trim(),
        });

        if (res.success) {
          showFeedback('success', `Expense of $${numAmount.toFixed(2)} recorded successfully!`);
          setIsAddModalOpen(false);
          resetForm();
          router.refresh();
        } else {
          showFeedback('error', res.error || 'Failed to record expense.');
        }
      }
    });
  };

  const handleDeleteExpense = async (id: string) => {
    startTransition(async () => {
      const res = await deleteExpense(id);
      if (res.success) {
        showFeedback('success', 'Expense deleted successfully.');
        setDeletingId(null);
        router.refresh();
      } else {
        showFeedback('error', res.error || 'Failed to delete expense.');
      }
    });
  };

  // Metrics
  const totalExpensesAmount = expenses.reduce((acc, exp) => acc + (parseFloat(String(exp.amount)) || 0), 0);
  const totalExpensesCount = expenses.length;
  const averageExpense = totalExpensesCount > 0 ? totalExpensesAmount / totalExpensesCount : 0;

  // Compute top category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    const cat = exp.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (parseFloat(String(exp.amount)) || 0);
  });
  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topCategoryEntry ? topCategoryEntry[0] : 'None';
  const topCategoryAmount = topCategoryEntry ? topCategoryEntry[1] : 0;

  // Filtered expenses based on search and category
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch =
      !searchQuery.trim() ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.vendor && exp.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.reference && exp.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || exp.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Software & Tools':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Hosting & Infrastructure':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Advertising & Marketing':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Contractors & Freelancers':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Office & Equipment':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Domains & Services':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case 'Legal & Accounting':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Taxes & Licenses':
        return 'bg-orange-50 text-orange-700 border-orange-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
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
        <div className="flex items-center justify-between text-xs text-gray-500 bg-rose-50/50 border border-rose-100 px-3.5 py-2.5 rounded-xl shadow-2xs">
          <span>
            Showing <strong className="text-gray-900">{expenses.length}</strong> of{' '}
            <strong className="text-gray-900">{allExpensesCount}</strong> total expense records for timeframe filter:{' '}
            <span className="font-semibold text-rose-600 uppercase">{period.replace('_', ' ')}</span>
          </span>
          {startDate && endDate && (
            <span>
              Range: {startDate} to {endDate}
            </span>
          )}
        </div>
      )}

      {/* Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            ${totalExpensesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">{totalExpensesCount} registered expenses in period</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Transactions</p>
            <span className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">
            {totalExpensesCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Processed expense entries</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Average Expense</p>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">
            ${averageExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Per transaction average</p>
        </div>

        <div className="bg-white rounded-xl shadow-xs p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Top Category</p>
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-900 mt-2 truncate">
            {topCategory}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {topCategoryAmount > 0 
              ? `$${topCategoryAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent` 
              : 'No expenses recorded'}
          </p>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search expenses by title, vendor, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          >
            <option value="all">All Categories</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Record Expense Button */}
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm rounded-xl shadow-xs hover:from-orange-600 hover:to-amber-600 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Record Expense</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Expense Records</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track company operational expenditures and bills</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredExpenses.length} records
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800">No expenses found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try clearing your search query or category filter.'
                : 'No company expenses have been registered for this timeframe yet. Click below to add your first expense.'}
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              + Record First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Vendor / Supplier</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                      {formatDateDisplay(exp.date)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{exp.title}</div>
                      {exp.notes && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">{exp.notes}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(exp.category)}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-700 font-medium">
                      {exp.vendor || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                        {exp.paymentMethod || 'Credit Card'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {exp.reference || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right font-extrabold text-rose-600">
                      -${parseFloat(String(exp.amount)).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Edit Expense"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeletingId(exp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Expense"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record / Edit Expense Modal */}
      {(isAddModalOpen || editingExpense) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingExpense ? 'Edit Expense' : 'Record Business Expense'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingExpense
                    ? 'Modify transaction details for this operational expenditure'
                    : 'Register an outgoing business cost or bill to deduct from revenue'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingExpense(null);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Workspace, Vultr Cloud Server, Meta Ads"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount ($ USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expense Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vendor / Merchant
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Vultr, AWS, Adobe"
                    value={formVendor}
                    onChange={(e) => setFormVendor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {EXPENSE_PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Invoice # / Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. INV-9042, TX-5819"
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context, recurrence, project attribution..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingExpense(null);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs hover:from-orange-600 hover:to-amber-600 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? 'Saving...' : editingExpense ? 'Save Changes' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete this expense?</h3>
            <p className="text-xs text-slate-500 mt-1">
              This action cannot be undone. This expense will be removed from your reports and profit calculations.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteExpense(deletingId)}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
