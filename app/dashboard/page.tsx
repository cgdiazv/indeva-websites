import { salesData } from '@/data/sales';

export default function SalesDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Sales Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesData.map((sale) => (
              <tr key={sale["Order ID"]}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{sale["Order ID"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale["Customer Name"]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale["Total Sales"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}