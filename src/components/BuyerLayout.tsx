'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Package, Clock, RotateCcw, Settings, Bell, LogOut, User, MapPin, Key, Mail, Phone, ChevronRight, X, Menu } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: Home, href: '/dashboard/buyer' },
  { name: 'Orders', icon: Package, href: '/dashboard/buyer/orders' },
  { name: 'Returns', icon: RotateCcw, href: '/dashboard/buyer/returns' },
  { name: 'Track Orders', icon: Clock, href: '/dashboard/buyer/track' },
  { name: 'Address Book', icon: MapPin, href: '/dashboard/buyer/addresses' },
  { name: 'Account', icon: Settings, href: '/dashboard/buyer/account' },
  { name: 'Notifications', icon: Bell, href: '/dashboard/buyer/notifications' },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-orange-600">My Account</h1>
          <div className="w-8" /> {/* spacer */}
        </div>
      </header>

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:shadow-none`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b flex items-center justify-between md:justify-start">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              JHORA
            </Link>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={28} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={22} className="mr-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t">
            <button className="flex items-center text-red-600 hover:text-red-800 w-full">
              <LogOut size={22} className="mr-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around py-3">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-gray-600 hover:text-orange-600 text-xs"
            >
              <item.icon size={24} />
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}