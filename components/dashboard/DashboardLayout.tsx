'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import HostingManagement from './HostingManagement';
import type { HostingAccount } from '@/lib/hostingUtils';
import { logout } from '@/app/actions/auth';

interface DashboardLayoutProps {
  salesContent: React.ReactNode;
  hostings: HostingAccount[];
  salesCount: number;
  dueSoonCount: number;
  overdueCount: number;
}

export default function DashboardLayout({
  salesContent,
  hostings,
  salesCount,
  dueSoonCount,
  overdueCount,
}: DashboardLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get('tab') === 'hostings' ? 'hostings' : 'sales';
  const [activeTab, setActiveTab] = useState<'sales' | 'hostings'>(initialTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'hostings' || tabParam === 'sales') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab: 'sales' | 'hostings') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const alertBadgeCount = dueSoonCount + overdueCount;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Navbar with Logo and Drawer Toggle */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="flex items-center gap-2.5 group" title="Return to Home Page">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
            I
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">Indeva</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 ml-1.5 px-1.5 py-0.5 bg-orange-50 border border-orange-200 rounded">
              Admin
            </span>
          </div>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Backdrop for Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation (Light Theme) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 bg-white text-gray-700 border-r border-gray-200/90 flex flex-col justify-between shadow-xs transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } h-screen`}
      >
        <div className="p-5 flex flex-col h-full overflow-y-auto">
          {/* Top Logo & Branding (Clickable to Home) */}
          <div className="pb-5 border-b border-gray-100">
            <Link
              href="/"
              className="flex items-center gap-3 group p-2 -m-2 rounded-xl hover:bg-orange-50/50 transition-all"
              title="Indeva Websites - Return to Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-xl shadow-sm group-hover:scale-105 transition-transform">
                I
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  Indeva
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 px-1.5 py-0.5 bg-orange-50 border border-orange-200 rounded">
                  Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="mt-6 flex-1 space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
                Operations
              </p>
              <nav className="space-y-1.5">
                {/* Sales & Revenue Tab */}
                <button
                  onClick={() => switchTab('sales')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'sales'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 ${activeTab === 'sales' ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Sales & Revenue</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'sales' 
                      ? 'bg-white/25 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {salesCount}
                  </span>
                </button>

                {/* Hosting Accounts & Renewals Tab */}
                <button
                  onClick={() => switchTab('hostings')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'hostings'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 ${activeTab === 'hostings' ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                    </svg>
                    <span>Hosting Renewals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {alertBadgeCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        overdueCount > 0 
                          ? 'bg-rose-500 text-white animate-pulse' 
                          : 'bg-amber-500 text-white'
                      }`}>
                        {alertBadgeCount}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'hostings' 
                        ? 'bg-white/25 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {hostings.length}
                    </span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Quick Links Section */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
                Quick Links
              </p>
              <div className="space-y-1">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Website
                  </span>
                  <span className="text-[10px] text-gray-400">↗</span>
                </Link>

                <Link
                  href="/book-free-audit"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Free Audit Form
                  </span>
                  <span className="text-[10px] text-gray-400">↗</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Sidebar: Status & Logout */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            {/* System Status Pill */}
            <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Database</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            </div>

            {/* Logout Action */}
            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>End Session (Logout)</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-[100rem]">
        {/* Dynamic View Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === 'sales' ? 'Sales & Revenue Stream' : 'Hosting Accounts & Renewals'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'sales' 
                ? 'Real-time sales tracking from Stripe and customer transactions' 
                : 'Customer domain lifecycle, renewal deadlines, and recurring revenue management'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sales' ? (
          <div>{salesContent}</div>
        ) : (
          <div>
            <HostingManagement initialHostings={hostings} />
          </div>
        )}
      </main>
    </div>
  );
}
