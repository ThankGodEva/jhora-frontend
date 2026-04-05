'use client';

import { useCartStore } from '@/lib/cartStore';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductHeader from '@/components/ProductHeader';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCartStore();

  // Safe price formatter
  const formatPrice = (price: any): string => {
    if (price == null || price === '') return '0';
    const num = typeof price === 'string' ? parseFloat(price) : Number(price);
    return isNaN(num) ? '0' : num.toLocaleString();
  };

  const handleRemove = (id: number) => {
    removeItem(id);
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (id: number, newQty: number) => {
    if (newQty < 1) return;
    updateQuantity(id, newQty);
  };

  if (totalItems() === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <ProductHeader />
        <ShoppingCart size={80} className="text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 text-center max-w-xs">Looks like you haven't added any products yet</p>
        <Link href="/" className="bg-orange-600 text-white px-10 py-4 rounded-2xl hover:bg-orange-700 transition font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart ({totalItems()})</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-sm">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{item.name}</h3>
                  <p className="text-orange-600 font-bold text-lg mt-1">
                    ₦{formatPrice(item.price)}
                  </p>

                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center border rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-4 py-3 hover:bg-gray-100 transition"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="px-8 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-4 py-3 hover:bg-gray-100 transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={20} />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₦{formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-8">
            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

            <div className="space-y-5">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal ({totalItems()} items)</span>
                <span className="font-semibold">₦{totalPrice().toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₦{totalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-orange-600 text-white py-5 rounded-2xl mt-10 text-lg font-bold hover:bg-orange-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}