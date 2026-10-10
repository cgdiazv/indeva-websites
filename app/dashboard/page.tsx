import { db } from '@/lib/firebaseAdmin';
import { type HostingAccount, calculateRenewalStatus } from '@/lib/hostingUtils';
import type { ExpenseRecord } from '@/lib/expenseUtils';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SalesManagement from '@/components/dashboard/SalesManagement';
import ExpensesManagement from '@/components/dashboard/ExpensesManagement';

// Tells Next.js to bypass caching so your sales dashboard is always real-time
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{
    period?: string;
    startDate?: string;
    endDate?: string;
    tab?: string;
  }>;
};

function filterRecords<T extends { date?: string }>(items: T[], period: string = 'all', startDateStr?: string, endDateStr?: string): T[] {
  if (period === 'all' || !period) return items;

  const now = new Date();

  return items.filter((item) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date);
    if (isNaN(itemDate.getTime())) return false;

    switch (period) {
      case 'today': {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return itemDate >= startOfToday;
      }
      case 'yesterday': {
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
        const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        return itemDate >= startOfYesterday && itemDate <= endOfYesterday;
      }
      case '7d': {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= sevenDaysAgo;
      }
      case '30d': {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= thirtyDaysAgo;
      }
      case 'this_month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        return itemDate >= startOfMonth;
      }
      case 'last_month': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
      }
      case 'custom': {
        let isValid = true;
        if (startDateStr) {
          const customStart = new Date(`${startDateStr}T00:00:00`);
          if (!isNaN(customStart.getTime())) {
            isValid = isValid && itemDate >= customStart;
          }
        }
        if (endDateStr) {
          const customEnd = new Date(`${endDateStr}T23:59:59.999`);
          if (!isNaN(customEnd.getTime())) {
            isValid = isValid && itemDate <= customEnd;
          }
        }
        return isValid;
      }
      default:
        return true;
    }
  });
}

export default async function SalesDashboard({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const period = resolvedSearchParams.period || 'all';
  const startDate = resolvedSearchParams.startDate;
  const endDate = resolvedSearchParams.endDate;

  let allSalesData: any[] = [];
  let hostingsData: HostingAccount[] = [];
  let allExpensesData: ExpenseRecord[] = [];

  try {
    // Fetch records in parallel from 'sales', 'hosting_accounts', and 'expenses' collections
    const [salesSnapshot, hostingsSnapshot, expensesSnapshot] = await Promise.all([
      db.collection('sales').orderBy('date', 'desc').get(),
      db.collection('hosting_accounts').orderBy('renewalDate', 'asc').get(),
      db.collection('expenses').get(),
    ]);

    allSalesData = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    hostingsData = hostingsSnapshot.docs.map(doc => {
      const data = doc.data();
      const calculated = calculateRenewalStatus(data.renewalDate, data.status || 'active');
      return {
        id: doc.id,
        ...data,
        status: calculated,
      } as HostingAccount;
    });

    allExpensesData = expensesSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }) as ExpenseRecord)
      .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return (
      <div className="min-h-screen bg-slate-900 text-rose-400 flex items-center justify-center p-8">
        <div className="bg-slate-950 p-6 rounded-2xl border border-rose-900/50 max-w-md text-center">
          <p className="font-semibold text-base mb-2">Error loading live data from Firestore</p>
          <p className="text-xs text-slate-400">Please check server credentials and logs.</p>
        </div>
      </div>
    );
  }

  // Filter sales and expenses based on selected period / date range
  const salesData = filterRecords(allSalesData, period, startDate, endDate);
  const expensesData = filterRecords(allExpensesData, period, startDate, endDate);

  // Calculate renewal alerts
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueSoonCount = hostingsData.filter(h => {
    if (h.status === 'suspended' || h.status === 'cancelled') return false;
    const renewalDate = new Date(h.renewalDate);
    renewalDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const overdueCount = hostingsData.filter(h => {
    if (h.status === 'suspended' || h.status === 'cancelled') return false;
    const renewalDate = new Date(h.renewalDate);
    renewalDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays < 0;
  }).length;

  const salesTabContent = (
    <SalesManagement
      sales={salesData}
      allSalesCount={allSalesData.length}
      period={period}
      startDate={startDate}
      endDate={endDate}
      hostings={hostingsData}
      expenses={expensesData}
    />
  );

  const expensesTabContent = (
    <ExpensesManagement
      expenses={expensesData}
      allExpensesCount={allExpensesData.length}
      period={period}
      startDate={startDate}
      endDate={endDate}
    />
  );

  return (
    <DashboardLayout
      salesContent={salesTabContent}
      hostings={hostingsData}
      salesCount={salesData.length}
      dueSoonCount={dueSoonCount}
      overdueCount={overdueCount}
      expensesContent={expensesTabContent}
      expensesCount={expensesData.length}
    />
  );
}
