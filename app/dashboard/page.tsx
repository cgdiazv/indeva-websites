import { db } from '@/lib/firebaseAdmin';
import { type HostingAccount, calculateRenewalStatus } from '@/lib/hostingUtils';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Tells Next.js to bypass caching so your sales dashboard is always real-time
export const dynamic = 'force-dynamic';

export default async function SalesDashboard() {
  let salesData: any[] = [];
  let hostingsData: HostingAccount[] = [];

  try {
    // Fetch records in parallel from 'sales' and 'hosting_accounts' collections
    const [salesSnapshot, hostingsSnapshot] = await Promise.all([
      db.collection('sales').orderBy('date', 'desc').get(),
      db.collection('hosting_accounts').orderBy('renewalDate', 'asc').get(),
    ]);

    salesData = salesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
    <div className="space-y-6">
      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-slate-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">Gross Stripe captured volume</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-slate-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">{totalOrders}</p>
          <p className="text-xs text-slate-400 mt-1">Processed transactions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-slate-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Items Sold</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 truncate">{totalItemsSold}</p>
          <p className="text-xs text-slate-400 mt-1">Subscriptions and services</p>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200/80">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Transaction History</h2>
          <span className="text-xs text-slate-500">{salesData.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/75">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Order #</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Customer Type</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">Product(s)</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Items Sold</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Net Sales</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Attribution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {salesData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-sm text-slate-500">
                    No live sales found in Firestore yet.
                  </td>
                </tr>
              ) : (
                salesData.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {sale.date ? new Date(sale.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      #{sale.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.status?.toLowerCase() === 'completed' || sale.status?.toLowerCase() === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : sale.status?.toLowerCase() === 'processing' || sale.status?.toLowerCase() === 'open' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {sale.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {sale.customer_type}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-[250px] truncate" title={sale.products || ""}>
                      {sale.products || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-900">
                      {sale.items_sold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">
                      ${parseFloat(sale.net_sales || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 capitalize">
                      {sale.attribution || 'Direct'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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