'use client'; // ← This MUST be at the very top (enables client-side hooks)
// 

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false); // close mobile menu if open
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile left side */}
            <div className="md:hidden flex items-center space-x-4">
              {/* <button
                onClick={() => router.push('/search')}
                className="text-gray-700"
              >
                <Search size={24} />
              </button> */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

             
            {/* Mobile Hamburger */}
            {/* <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button> */}

            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-orange-600">
              JHORA
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, creators, categories..."
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <Link href="/wishlist" className="text-gray-600 hover:text-orange-600">
                <Heart size={24} />
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-orange-600 relative">
                <ShoppingBag size={24} />
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-orange-600">
                <User size={24} />
              </Link>
            </div>

          </div>
        </div>

        {/* Mobile Menu – Slide-in from top-left */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full max-w-xs h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0">
              <div className="p-6 space-y-8 overflow-y-auto h-full">
                {/* Header with close */}
                <div className="flex items-center justify-between">
                  <Link href="/" className="text-2xl font-bold text-orange-600" onClick={() => setIsMenuOpen(false)}>
                    JHORA
                  </Link>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X size={32} className="text-gray-800" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, creators..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                </form>

                {/* Categories */}
                <div>
                  <h3 className="font-bold text-xl mb-4">Categories</h3>
                  <ul className="space-y-4">
                    {['Health & Beauty', 'Fashion', 'Art & Collectibles', 'Home & Living', 'Perfume', 'Food'].map(cat => (
                      <li key={cat}>
                        <Link
                          href={`/category/${cat.toLowerCase().replace(/ & /g, '-')}`}
                          className="text-lg text-gray-800 hover:text-orange-600 block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {cat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* My Account */}
                <div>
                  <h3 className="font-bold text-xl mb-4">My Account</h3>
                  <ul className="space-y-4">
                    <li><Link href="/dashboard" className="text-lg" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                    <li><Link href="/orders" className="text-lg" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
                    <li><Link href="/addresses" className="text-lg" onClick={() => setIsMenuOpen(false)}>Addresses</Link></li>
                    <li><Link href="/reviews" className="text-lg" onClick={() => setIsMenuOpen(false)}>Reviews</Link></li>
                  </ul>
                </div>

                {/* Need Help */}
                <div>
                  <h3 className="font-bold text-xl mb-4">Need Help?</h3>
                  <p className="text-lg mb-2">
                    Call: <a href="tel:+2348024468093" className="text-orange-600">+234 802 446 8093</a>
                  </p>
                  <p className="text-lg">
                    Email: <a href="mailto:info@jhora.ng" className="text-orange-600">info@jhora.ng</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">JHORA</h3>
              <p className="text-gray-400">
                Discover authentic handmade products from Nigerian creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categories">Categories</Link></li>
                <li><Link href="/featured">Featured</Link></li>
                <li><Link href="/new">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Creators</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/become-creator">Become a Creator</Link></li>
                <li><Link href="/creators">Explore Creators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} JHORA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}