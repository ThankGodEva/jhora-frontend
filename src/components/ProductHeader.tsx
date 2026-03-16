'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter, usePathname } from 'next/navigation';

export default function ProductHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());

  // Generate breadcrumb from current path
  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // For product pages: /product/[slug]
    if (pathSegments[0] === 'product' && pathSegments[1]) {
      return [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' }, // or your category page
        { label: 'Product', href: '#' }, // last item not clickable
      ];
    }

    // Fallback for other pages
    return [
      { label: 'Home', href: '/' },
      { label: pathSegments[0] || 'Page', href: '#' },
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb row */}
        <nav className="py-3 text-sm text-gray-600 hidden md:flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {crumb.href && crumb.href !== '#' ? (
                <Link href={crumb.href} className="hover:text-orange-600 transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-orange-600 font-medium">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
            </span>
          ))}
        </nav>

        {/* Main header row */}
        <div className="flex items-center justify-between py-4">
          {/* Back button (mobile-friendly) */}
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition md:hidden"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>

          {/* Logo (centered on mobile, left on desktop) */}
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold text-orange-600 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          >
            JHORA
          </Link>

          {/* Cart icon */}
          <Link href="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-orange-600">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="hidden md:inline"></span>
          </Link>
        </div>
      </div>
    </header>
  );
}