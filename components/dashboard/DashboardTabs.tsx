'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HostingManagement from './HostingManagement';
import type { HostingAccount } from '@/lib/hostingUtils';

interface DashboardTabsProps {
  salesContent: React.ReactNode;
  hostings: HostingAccount[];
  salesCount: number;
  dueSoonCount: number;
  overdueCount: number;
}

export default function DashboardTabs({
  salesContent,
  hostings,
  salesCount,
  dueSoonCount,
  overdueCount,
}: DashboardTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get('tab') === 'hostings' ? 'hostings' : 'sales';
  const [activeTab, setActiveTab] = useState<'sales' | 'hostings'>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'hostings' || tabParam === 'sales') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab: 'sales' | 'hostings') => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const alertBadgeCount = dueSoonCount + overdueCount;

  return (
    <div className="space-y-6">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-200/70 backdrop-blur-md rounded-2xl w-fit border border-gray-300/60 shadow-inner">
        <button
          onClick={() => switchTab('sales')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'sales'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          <svg className={`w-4 h-4 ${activeTab === 'sales' ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Sales & Revenue
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gray-100 text-gray-700">
            {salesCount}
          </span>
        </button>

        <button
          onClick={() => switchTab('hostings')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'hostings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          <svg className={`w-4 h-4 ${activeTab === 'hostings' ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
          </svg>
          Hosting Accounts & Renewals
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gray-100 text-gray-700">
            {hostings.length}
          </span>
          {alertBadgeCount > 0 && (
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
              overdueCount > 0 ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-white'
            }`}>
              {alertBadgeCount} due
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'sales' ? (
          <div>{salesContent}</div>
        ) : (
          <div>
            <HostingManagement initialHostings={hostings} />
          </div>
        )}
      </div>
    </div>
  );
}
