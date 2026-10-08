import { db } from '@/lib/firebaseAdmin';
import { type HostingAccount, calculateRenewalStatus } from '@/lib/hostingUtils';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SalesManagement from '@/components/dashboard/SalesManagement';

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

function filterSales(sales: any[], period: string = 'all', startDateStr?: string, endDateStr?: string) {
  if (period === 'all' || !period) return sales;

  const now = new Date();

  return sales.filter((sale) => {
    if (!sale.date) return false;
    const saleDate = new Date(sale.date);
    if (isNaN(saleDate.getTime())) return false;

    switch (period) {
      case 'today': {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return saleDate >= startOfToday;
      }
      case 'yesterday': {
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
        const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        return saleDate >= startOfYesterday && saleDate <= endOfYesterday;
      }
      case '7d': {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= sevenDaysAgo;
      }
      case '30d': {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= thirtyDaysAgo;
      }
      case 'this_month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        return saleDate >= startOfMonth;
      }
      case 'last_month': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return saleDate >= startOfLastMonth && saleDate <= endOfLastMonth;
      }
      case 'custom': {
        let isValid = true;
        if (startDateStr) {
          const customStart = new Date(`${startDateStr}T00:00:00`);
          if (!isNaN(customStart.getTime())) {
            isValid = isValid && saleDate >= customStart;
          }
        }
        if (endDateStr) {
          const customEnd = new Date(`${endDateStr}T23:59:59.999`);
          if (!isNaN(customEnd.getTime())) {
            isValid = isValid && saleDate <= customEnd;
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

  try {
    // Fetch records in parallel from 'sales' and 'hosting_accounts' collections
    const [salesSnapshot, hostingsSnapshot] = await Promise.all([
      db.collection('sales').orderBy('date', 'desc').get(),
      db.collection('hosting_accounts').orderBy('renewalDate', 'asc').get(),
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

  // Filter sales based on selected period / date range
  const salesData = filterSales(allSalesData, period, startDate, endDate);

  // Calculate Metrics Aggregations for Sales
  const totalRevenue = salesData.reduce((acc: number, sale: any) => acc + parseFloat(sale.net_sales || 0), 0);
  const totalOrders = salesData.length;
  const totalItemsSold = salesData.reduce((acc: number, sale: any) => acc + parseInt(sale.items_sold || 0, 10), 0);

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
    />
  );

  return (
    <DashboardLayout
      salesContent={salesTabContent}
      hostings={hostingsData}
      salesCount={salesData.length}
      dueSoonCount={dueSoonCount}
      overdueCount={overdueCount}
    />
  );
}
