'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export type DatePeriod = 'all' | 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'last_month' | 'custom';

export default function DashboardDateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPeriod = (searchParams.get('period') as DatePeriod) || 'all';
  const currentStartDate = searchParams.get('startDate') || '';
  const currentEndDate = searchParams.get('endDate') || '';

  const [startDate, setStartDate] = useState(currentStartDate);
  const [endDate, setEndDate] = useState(currentEndDate);

  useEffect(() => {
    setStartDate(currentStartDate);
    setEndDate(currentEndDate);
  }, [currentStartDate, currentEndDate]);

  const updateFilters = (period: DatePeriod, customStart?: string, customEnd?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', period);

    if (period === 'custom') {
      if (customStart) params.set('startDate', customStart);
      else params.delete('startDate');

      if (customEnd) params.set('endDate', customEnd);
      else params.delete('endDate');
    } else {
      params.delete('startDate');
      params.delete('endDate');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const presets: { id: DatePeriod; label: string }[] = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: 'this_month', label: 'This Month' },
    { id: 'last_month', label: 'Last Month' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Presets Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 hidden lg:inline-block">
            Filter:
          </span>
          {presets.map((preset) => {
            const isActive = currentPeriod === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => updateFilters(preset.id, startDate, endDate)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm font-semibold'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Date Picker Form */}
        {currentPeriod === 'custom' && (
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500 font-medium">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-gray-500 font-medium">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 bg-white"
              />
            </div>
            <button
              onClick={() => updateFilters('custom', startDate, endDate)}
              className="bg-gray-900 text-white hover:bg-gray-800 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
