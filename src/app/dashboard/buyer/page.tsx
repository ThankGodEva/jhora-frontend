import BuyerLayout from '@/components/BuyerLayout';
import { Home, Package, Clock, RotateCcw, Settings, Bell, LogOut, User, MapPin, Key, Mail, Phone, ChevronRight, X, Menu } from 'lucide-react';

export default function BuyerDashboard() {
  return (
    <BuyerLayout>
      <div className="space-y-10">
        {/* Profile Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">
              TM
            </div>
            <div>
              <h2 className="text-xl font-bold">Teniola Matthews</h2>
              <p className="text-gray-600">@teniolamatthews</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-gray-600 text-sm">Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4.8 ★</p>
              <p className="text-gray-600 text-sm">Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold">₦0</p>
              <p className="text-gray-600 text-sm">Wallet</p>
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-gray-600 text-sm">Returns</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <button className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition">
            <Package className="mx-auto mb-3 text-orange-600" size={32} />
            <p className="font-medium">My Orders</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition">
            <RotateCcw className="mx-auto mb-3 text-purple-600" size={32} />
            <p className="font-medium">Return Requests</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition">
            <Clock className="mx-auto mb-3 text-blue-600" size={32} />
            <p className="font-medium">Track Orders</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition">
            <MapPin className="mx-auto mb-3 text-green-600" size={32} />
            <p className="font-medium">Addresses</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition">
            <Settings className="mx-auto mb-3 text-gray-600" size={32} />
            <p className="font-medium">Account Settings</p>
          </button>
          <button className="bg-white p-6 rounded-xl shadow text-center hover:shadow-md transition">
            <Bell className="mx-auto mb-3 text-red-600" size={32} />
            <p className="font-medium">Notifications</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Activity</h2>
          </div>
          <div className="divide-y">
            <div className="p-6 flex justify-between items-center">
              <div>
                <p className="font-medium">Order #JH-1384516</p>
                <p className="text-sm text-gray-600">Manik mini bag • Pending</p>
              </div>
              <span className="text-yellow-600 font-medium">Pending</span>
            </div>
            {/* Add 3-4 more activity items */}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}