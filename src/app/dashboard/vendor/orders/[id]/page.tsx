'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import api from '@/lib/api';

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/vendor/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    try {
      await api.patch(`/vendor/orders/${id}/status`, { status: newStatus });
      fetchOrder();
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
        <button onClick={() => router.back()} className="text-orange-600 hover:underline">
          ← Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6">
        <ArrowLeft size={20} /> Back to Orders
      </button>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <p className="text-gray-600 mt-1">{order.date} • {order.customer_name}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Customer & Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Email:</strong> {order.customer_email}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>Address:</strong> {order.shipping_address}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <p><strong>Total:</strong> ₦{order.total.toLocaleString()}</p>
            <p><strong>Items:</strong> {order.items_count}</p>
            <p><strong>Payment:</strong> {order.payment_method} ({order.payment_status})</p>
            <p><strong>Delivery:</strong> {order.delivery_status}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Items ({order.items_count})</h3>
          <div className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 border-b pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">₦{item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Update Order
          </button>
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <button className="flex-1 border border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition">
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-3 border rounded-lg mb-6"
            >
              <option value="">Select new status</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={updateOrderStatus}
                disabled={!newStatus}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}