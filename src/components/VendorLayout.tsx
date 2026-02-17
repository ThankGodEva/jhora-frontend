'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, Bell, LogOut, Menu, X } from 'lucide-react';
import { DollarSign } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/vendor' },
  { name: 'Orders', icon: ShoppingBag, href: '/dashboard/vendor/orders' },
  { name: 'Products', icon: Package, href: '/dashboard/vendor/products' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/vendor/analytics' },
  { name: 'Shop', icon: ShoppingBag, href: '/dashboard/vendor/shop' },
  { name: 'Payment', icon: DollarSign, href: '/dashboard/vendor/payment' },
  { name: 'Settings', icon: Settings, href: '/dashboard/vendor/settings' },
  { name: 'Notifications', icon: Bell, href: '/dashboard/vendor/notifications' },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={28} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-orange-600">Vendor Dashboard</h1>
          <div className="w-8" /> {/* spacer */}
        </div>
      </header>

      {/* Sidebar (desktop + mobile drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:shadow-none`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between md:justify-start">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              JHORA
            </Link>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={28} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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

          {/* Logout */}
          <div className="p-6 border-t">
            <button className="flex items-center text-red-600 hover:text-red-800 w-full">
              <LogOut size={22} className="mr-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-72">
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around py-3">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-gray-600 hover:text-orange-600"
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}