import { db } from '@/lib/firebaseAdmin';

// Tells Next.js to bypass caching so your sales dashboard is always real-time
export const dynamic = 'force-dynamic';

export default async function SalesDashboard() {
  let salesData: any[] = [];

  try {
    // Fetch records from the 'sales' collection sorted by date descending
    const snapshot = await db.collection('sales').orderBy('date', 'desc').get();
    
    salesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return <div className="p-24 text-red-500">Error loading live data from Firestore. Check logs.</div>;
  }

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Live streaming revenue engine via Stripe & Firebase</p>
        </div>
        <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
          Firebase Active
        </span>
      </div>
      
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Coupon(s)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Net Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Attribution</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-sm text-gray-500">
                  No live sales found in Firestore yet.
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.coupons || '-'}
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