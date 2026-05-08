import { salesData } from '@/data/sales';

export default function SalesDashboard() {
  return (
    <div className="max-w-[95rem] mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Sales Dashboard</h1>
      
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.map((sale) => (
              <tr key={sale.order_number} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{sale.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sale.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 
                    sale.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' : 
                    sale.status?.toLowerCase() === 'cancelled' || sale.status?.toLowerCase() === 'failed' ? 'bg-red-100 text-red-800' :
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
                {/* Fix applied here: Added fallback for null products */}
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
                  ${sale.net_sales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {sale.attribution || 'Direct'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}