import VendorLayout from '@/components/VendorLayout';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, Star } from '@/lib/icons';

export default function VendorHome() {
  return (
    <VendorLayout>
      <div className="space-y-10">
        {/* Welcome & Stats */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, @Tenibags</h1>
          <p className="text-gray-600">Here's what's happening with your shop today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold mt-1">₦1,234,567</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <DollarSign className="text-orange-600" size={28} />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">↑ 23% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold mt-1">34</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="text-blue-600" size={28} />
              </div>
            </div>
            <p className="text-blue-600 text-sm mt-2">12 pending processing</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Products Listed</p>
                <p className="text-2xl font-bold mt-1">126</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="text-green-600" size={28} />
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">3 out of stock</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Shop Rating</p>
                <p className="text-2xl font-bold mt-1">4.8 ★</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="text-yellow-600 fill-yellow-600" size={28} />
              </div>
            </div>
            <p className="text-yellow-600 text-sm mt-2">Based on 236 reviews</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/dashboard/vendor/orders" className="text-orange-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#JH-1384516</td>
                  <td className="px-6 py-4">Teniola Matthews</td>
                  <td className="px-6 py-4 font-medium">₦48,000</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-orange-600 hover:text-orange-800">View</button>
                  </td>
                </tr>
                {/* Add 3-4 more rows */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Add New Product</h3>
            <p className="mb-6 opacity-90">Upload your next best seller and reach more customers</p>
            <Link href="/dashboard/vendor/add-product" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition">
              Start Uploading
            </Link>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">View Analytics</h3>
            <p className="mb-6 opacity-90">See sales trends, top products, and customer insights</p>
            <Link href="/dashboard/vendor/analytics" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition">
              Open Analytics
            </Link>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}