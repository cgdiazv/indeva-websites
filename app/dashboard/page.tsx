import { db } from '@/lib/firebaseAdmin';
import { logout } from '@/app/actions/auth';
import DashboardDateFilter from '@/components/DashboardDateFilter';

// Tells Next.js to bypass caching so your sales dashboard is always real-time
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{
    period?: string;
    startDate?: string;
    endDate?: string;
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

  try {
    // Fetch records from the 'sales' collection sorted by date descending
    const snapshot = await db.collection('sales').orderBy('date', 'desc').get();
    
    allSalesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return <div className="p-24 text-red-500">Error loading live data from Firestore. Check logs.</div>;
  }

  // Filter sales based on selected period / date range
  const salesData = filterSales(allSalesData, period, startDate, endDate);

  // Calculate Metrics Aggregations
  const totalRevenue = salesData.reduce((acc: number, sale: any) => acc + parseFloat(sale.net_sales || 0), 0);
  const totalOrders = salesData.length;
  const totalItemsSold = salesData.reduce((acc: number, sale: any) => acc + parseInt(sale.items_sold || 0, 10), 0);

  return (
    <div className="max-w-[95rem] mx-auto px-4 pt-4 sm:pt-24 pb-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Live streaming revenue engine via Stripe & Firebase</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            Firebase Active
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="text-gray-500 hover:text-gray-700 transition-colors bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:shadow-md"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Date Filter Bar */}
      <DashboardDateFilter />

      {/* Filter Status Badge */}
      {period !== 'all' && (
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500 bg-orange-50/50 border border-orange-100 px-3 py-2 rounded-lg">
          <span>
            Showing <strong className="text-gray-900">{salesData.length}</strong> of <strong className="text-gray-900">{allSalesData.length}</strong> total records for timeframe filter: <span className="font-semibold text-orange-600 uppercase">{period.replace('_', ' ')}</span>
          </span>
          {startDate && endDate && (
            <span>Range: {startDate} to {endDate}</span>
          )}
        </div>
      )}

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-3 sm:p-6 border border-gray-200 overflow-hidden">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Total Revenue</p>
          <p className="text-base sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-3 sm:p-6 border border-gray-200 overflow-hidden">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Total Orders</p>
          <p className="text-base sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-6 border border-gray-200 overflow-hidden">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Items Sold</p>
          <p className="text-base sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">{totalItemsSold}</p>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Product(s)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Items Sold</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Net Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Attribution</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                  {allSalesData.length === 0
                    ? "No live sales found in Firestore yet."
                    : "No sales records match the selected date filter."}
                </td>
              </tr>
            ) : (
              salesData.map((sale: any) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.date ? new Date(sale.date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{sale.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.status?.toLowerCase() === 'completed' || sale.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 
                      sale.status?.toLowerCase() === 'processing' || sale.status?.toLowerCase() === 'open' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.customer_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[250px] truncate" title={sale.products || ""}>
                    {sale.products || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                    {sale.items_sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    ${parseFloat(sale.net_sales || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {sale.attribution || 'Direct'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}