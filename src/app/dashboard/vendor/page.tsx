'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function VendorDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/vendor/dashboard');
      setStats(res.data.stats);
      setRecentOrders(res.data.recentOrders || []);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      {/* Welcome & Quick Stats */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Tenibags</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your shop today</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingBag className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">₦{stats.totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/dashboard/vendor/orders" className="text-orange-600 hover:underline text-sm">
            View all orders →
          </Link>
        </div>

        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No recent orders yet
            </div>
          ) : (
            recentOrders.map((order: any) => (
              <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Order #{order.order_number}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customer_name} • {order.date}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-orange-600">₦{order.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.items} items</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 p-4 rounded-lg text-center font-medium">
              Add New Product
            </button>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-4 rounded-lg text-center font-medium">
              Process Pending Orders
            </button>
            <button className="bg-green-50 hover:bg-green-100 text-green-600 p-4 rounded-lg text-center font-medium">
              View Analytics
            </button>
            <button className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-4 rounded-lg text-center font-medium">
              Update Store Profile
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {/* Mock top products - replace with real data */}
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <img src="https://via.placeholder.com/64" alt="Product" className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-medium">T-Mank Mini Bag</p>
                  <p className="text-sm text-gray-600">₦48,000 • 45 sold</p>
                </div>
                <span className="text-green-600 font-medium">+12%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}