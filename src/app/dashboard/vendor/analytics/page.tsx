'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '@/lib/api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState('this_month');
  const [analytics, setAnalytics] = useState<any>({
    salesData: [],
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topProducts: [],
    topCategories: [],
    customerMetrics: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/analytics', { params: { range: timeRange } });
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
      // Fallback mock data
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: analytics.salesData?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: analytics.salesData?.map((d: any) => d.revenue) || [],
        borderColor: '#FF6200',
        backgroundColor: 'rgba(255, 98, 0, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Orders',
        data: analytics.salesData?.map((d: any) => d.orders) || [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Sales & Orders Over Time' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your shop performance and growth</p>
        </div>

        <div className="flex gap-3">
          {['today', 'this_week', 'this_month', 'last_3_months'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading analytics...</div>
      ) : (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <DollarSign className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">₦{analytics.totalSales?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ShoppingCart className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{analytics.totalOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Order Value</p>
                  <p className="text-2xl font-bold">₦{analytics.avgOrderValue?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unique Customers</p>
                  <p className="text-2xl font-bold">{analytics.customerMetrics?.uniqueCustomers || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Sales & Orders Trend</h2>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Top Products</h2>
              <div className="space-y-4">
                {analytics.topProducts?.map((product: any, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/48'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">₦{product.price.toLocaleString()} • {product.sales} sold</p>
                    </div>
                    <span className="text-green-600 font-medium">+{product.growth}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
              <div className="space-y-4">
                {analytics.topCategories?.map((cat: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-600">₦{cat.revenue.toLocaleString()} ({cat.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Metrics */}
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-lg font-semibold mb-4">Customer Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">New Customers</p>
                <p className="text-xl font-bold">{analytics.customerMetrics?.newCustomers || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Returning Customers</p>
                <p className="text-xl font-bold">{analytics.customerMetrics?.returningCustomers || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Retention</p>
                <p className="text-xl font-bold">{analytics.customerMetrics?.retentionRate || '0'}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Lifetime Value</p>
                <p className="text-xl font-bold">₦{analytics.customerMetrics?.avgLifetimeValue?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Mock fallback data (remove when real API works)
function getMockAnalytics() {
  return {
    salesData: [
      { date: 'Jan 1', revenue: 450000, orders: 12 },
      { date: 'Jan 8', revenue: 620000, orders: 18 },
      { date: 'Jan 15', revenue: 380000, orders: 10 },
      { date: 'Jan 22', revenue: 780000, orders: 22 },
      { date: 'Jan 29', revenue: 920000, orders: 25 },
    ],
    totalSales: 3150000,
    totalOrders: 87,
    avgOrderValue: 36207,
    topProducts: [
      { name: 'T-Mank Mini Bag', price: 48000, sales: 45, growth: 18 },
      { name: 'Classic Tote', price: 65000, sales: 32, growth: 12 },
      { name: 'Zara Core Pack', price: 45000, sales: 28, growth: 9 },
    ],
    topCategories: [
      { name: 'Bags', revenue: 1850000, percentage: 59 },
      { name: 'Accessories', revenue: 980000, percentage: 31 },
      { name: 'Fashion', revenue: 320000, percentage: 10 },
    ],
    customerMetrics: {
      newCustomers: 42,
      returningCustomers: 18,
      retentionRate: 43,
      avgLifetimeValue: 72000,
    },
  };
}