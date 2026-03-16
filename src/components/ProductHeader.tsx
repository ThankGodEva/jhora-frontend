'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter } from 'next/navigation';

export default function ProductHeader() {
  const router = useRouter();
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>

        {/* Logo / Title */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-orange-600">
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
        </Link>
      </div>
    </header>
  );
}