'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ShoppingBag, Store, User } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardLanding() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get('/me');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading account...</p>
      </div>
    );
  }

  if (!user) {
    return null; // redirect already handled
  }

  const isVendor = ['icreator', 'vendor'].includes(user.role?.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-orange-600 p-6 text-white text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-4 border-white mb-4">
            <img
              src={user.avatar || 'https://via.placeholder.com/80'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm opacity-90 mt-1">{user.email}</p>
          <p className="text-xs mt-2">
            {isVendor ? 'Vendor & Customer Account' : 'Customer Account'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-4">
          {/* Always show Buyer Dashboard */}
          <Link
            href="/dashboard/buyer"
            className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            <ShoppingBag size={20} />
            Go to Buyer Dashboard
          </Link>

          {/* Show Vendor Dashboard only if user is a vendor */}
          {isVendor && (
            <Link
              href="/dashboard/vendor"
              className="flex items-center justify-center gap-3 w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition font-medium"
            >
              <Store size={20} />
              Go to Vendor Dashboard
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/login');
            }}
            className="flex items-center justify-center gap-3 w-full border border-red-600 text-red-600 py-4 rounded-xl hover:bg-red-50 transition font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}