'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import OrderCard from '@/components/OrderCard';
import api from '@/lib/api';

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/orders', { params: { status: activeTab === 'all' ? null : activeTab } });
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: string) => {
    // Open update modal or redirect to details
    router.push(`/dashboard/vendor/orders/${id}`);
  };

  const handleDetails = (id: string) => {
    router.push(`/dashboard/vendor/orders/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b mb-6">
        {['All', 'Completed', 'Pending', 'Returned', 'Ongoing', 'Cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-3 font-medium whitespace-nowrap ${
              activeTab === tab.toLowerCase()
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium">No orders yet</h2>
          <p className="mt-2">When customers place orders, they’ll appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdate={handleUpdate}
              onDetails={handleDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}