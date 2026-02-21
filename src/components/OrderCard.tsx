import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, DollarSign } from 'lucide-react';

interface OrderCardProps {
  order: {
    id: string;
    order_number: string;
    customer_name: string;
    date: string;
    total: number;
    items: number;
    status: 'pending' | 'shipped' | 'completed' | 'cancelled' | 'returned' | 'ongoing';
    payment_status?: string;
    delivery_status?: string;
  };
  onUpdate?: (id: string) => void;
  onDetails?: (id: string) => void;
}

export default function OrderCard({ order, onUpdate, onDetails }: OrderCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-purple-100 text-purple-800',
    ongoing: 'bg-orange-100 text-orange-800',
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    shipped: <Truck size={16} />,
    completed: <CheckCircle size={16} />,
    cancelled: <XCircle size={16} />,
    returned: <AlertCircle size={16} />,
    ongoing: <Package size={16} />,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">Order #{order.order_number}</p>
          <p className="text-sm text-gray-600 mt-1">
            {order.customer_name} • {order.date}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[order.status]}`}>
          {statusIcons[order.status]}
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">{order.items} items</p>
          <p className="font-bold text-orange-600 mt-1">₦{order.total.toLocaleString()}</p>
        </div>

        <div className="flex gap-3">
          {onUpdate && (
            <button
              onClick={() => onUpdate(order.id)}
              className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
            >
              Update
            </button>
          )}
          {onDetails && (
            <button
              onClick={() => onDetails(order.id)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
            >
              Details
            </button>
          )}
        </div>
      </div>

      {order.payment_status && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <DollarSign size={14} />
          Payment: {order.payment_status}
        </div>
      )}
    </div>
  );
}