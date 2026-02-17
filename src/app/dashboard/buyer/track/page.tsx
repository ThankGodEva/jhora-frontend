'use client';

import { useState } from 'react';
import BuyerLayout from '@/components/BuyerLayout';
import { Search, Clock, CheckCircle, XCircle, RotateCcw, ChevronDown, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  number: string;
  productName: string;
  productImage: string;
  quantity: number;
  color: string;
  size: string;
  vendorName: string;
  total: string;
  dateOrdered: string;
  status: 'ongoing' | 'completed' | 'cancelled' | 'returned';
  trackingSteps: {
    title: string;
    date?: string;
    status: 'completed' | 'pending' | 'current' | 'failed';
  }[];
}

export default function TrackOrders() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed' | 'cancelled' | 'returned'>('ongoing');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data (replace with real API later)
  const orders: Order[] = [
    {
      id: '1',
      number: 'JH1384516',
      productName: 'Manik mini bag',
      productImage: 'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=Bag',
      quantity: 3,
      color: 'Orange, Blue',
      size: '',
      vendorName: 'Teniola Matthews',
      total: '₦48,000',
      dateOrdered: '02/02/2026',
      status: 'ongoing',
      trackingSteps: [
        { title: 'Order placed', date: '02/02/2026', status: 'completed' },
        { title: 'Order received by vendor', date: '02/03/2026', status: 'completed' },
        { title: 'Order shipped', date: '02/05/2026', status: 'current' },
        { title: 'In transit', status: 'pending' },
        { title: 'Delivered', status: 'pending' },
      ],
    },
    {
      id: '2',
      number: 'JH1384517',
      productName: 'Manik mini bag',
      productImage: 'https://via.placeholder.com/80x80/000000/FFFFFF?text=Bag',
      quantity: 1,
      color: 'Brown',
      size: '',
      vendorName: 'Sunlere Jumia Hub',
      total: '₦48,000',
      dateOrdered: '02/01/2026',
      status: 'completed',
      trackingSteps: [
        { title: 'Order placed', date: '02/01/2026', status: 'completed' },
        { title: 'Order received by vendor', date: '02/02/2026', status: 'completed' },
        { title: 'Order shipped', date: '02/04/2026', status: 'completed' },
        { title: 'In transit', date: '02/06/2026', status: 'completed' },
        { title: 'Delivered', date: '02/08/2026', status: 'completed' },
      ],
    },
    // Add more mock orders...
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'ongoing' && order.status !== activeTab) return false;
    if (searchTerm && !order.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.productName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <BuyerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Track Orders</h1>

          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search order number, SKU..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-2">
          {['Ongoing', 'Completed', 'Cancelled', 'Returned'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as any)}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition ${
                activeTab === tab.toLowerCase()
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            No {activeTab} orders found
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
                {/* Order Summary */}
                <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-gray-600">Qty: {order.quantity} • {order.color} • {order.size}</p>
                      <p className="text-sm text-gray-500">Vendor: {order.vendorName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-orange-600">{order.total}</p>
                    <p className="text-sm text-gray-500">{order.dateOrdered}</p>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Order Progress</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="relative">
                    {/* Progress bar background */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${(order.trackingSteps.filter(s => s.status === 'completed').length / order.trackingSteps.length) * 100}%` }}
                      />
                    </div>

                    {/* Steps */}
                    <div className="flex justify-between mt-6">
                      {order.trackingSteps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                            step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                            step.status === 'current' ? 'bg-orange-500 border-orange-500 text-white animate-pulse' :
                            step.status === 'failed' ? 'bg-red-500 border-red-500 text-white' :
                            'bg-gray-200 border-gray-300 text-gray-600'
                          }`}>
                            {step.status === 'completed' ? <CheckCircle size={16} /> : idx + 1}
                          </div>
                          <p className="text-xs mt-2 font-medium">{step.title}</p>
                          {step.date && <p className="text-xs text-gray-500 mt-1">{step.date}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-8">
                    <button className="flex-1 border border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition">
                      View Order Details
                    </button>
                    {order.status === 'ongoing' && (
                      <button className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition">
                        Track Order
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'returned' && (
                      <button className="flex-1 border border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition">
                        Report Issue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}