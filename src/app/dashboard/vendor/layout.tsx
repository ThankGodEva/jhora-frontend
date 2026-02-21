'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Bell, Menu, Package, ShoppingBag, BarChart3, Settings, CreditCard, LogOut, ChevronDown } from 'lucide-react';
import api from '@/lib/api';

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get('/me');
        if (res.data.role !== 'icreator' && res.data.role !== 'vendor') {
          router.push('/');
          return;
        }
        setUser(res.data);
      } catch (err: any) {
        console.error('Auth check failed:', err);
        // Only remove token on 401 (unauthorized)
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          // For 500/404/etc., show error or fallback
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden">
              <Menu size={24} />
            </button>
            <Link href="/dashboard/vendor" className="text-xl font-bold text-orange-600">
              JHORA Seller
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/notifications" className="relative">
              <Bell size={24} className="text-gray-700 hover:text-orange-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                3
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <img
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-600"
              />
              <div className="hidden md:block">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">@{user.vendor?.slug}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r h-screen sticky top-16 overflow-y-auto">
          <nav className="p-4 space-y-2">
            <Link href="/dashboard/vendor" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <Home size={20} /> Dashboard
            </Link>
            <Link href="/dashboard/vendor/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <Package size={20} /> Orders
            </Link>
            <Link href="/dashboard/vendor/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <ShoppingBag size={20} /> Products
            </Link>
            <Link href="/dashboard/vendor/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <BarChart3 size={20} /> Analytics
            </Link>
            <Link href="/dashboard/vendor/payments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <CreditCard size={20} /> Payments
            </Link>
            <Link href="/dashboard/vendor/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <Settings size={20} /> Settings
            </Link>
            <Link href="/dashboard/vendor/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600">
              <Bell size={20} /> Notifications
            </Link>
            <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full text-left">
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
          <div className="flex justify-around py-3">
            <Link href="/dashboard/vendor" className="flex flex-col items-center text-gray-600 hover:text-orange-600">
              <Home size={24} />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/dashboard/vendor/orders" className="flex flex-col items-center text-gray-600 hover:text-orange-600">
              <Package size={24} />
              <span className="text-xs">Orders</span>
            </Link>
            <Link href="/dashboard/vendor/products" className="flex flex-col items-center text-gray-600 hover:text-orange-600">
              <ShoppingBag size={24} />
              <span className="text-xs">Products</span>
            </Link>
            <Link href="/dashboard/vendor/analytics" className="flex flex-col items-center text-gray-600 hover:text-orange-600">
              <BarChart3 size={24} />
              <span className="text-xs">Analytics</span>
            </Link>
            <Link href="/dashboard/vendor/settings" className="flex flex-col items-center text-gray-600 hover:text-orange-600">
              <Settings size={24} />
              <span className="text-xs">Settings</span>
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}