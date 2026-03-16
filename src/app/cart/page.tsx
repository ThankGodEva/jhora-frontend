'use client';

import { useCartStore } from '@/lib/cartStore';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCartStore();

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <ShoppingCart size={80} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          href="/"
          className="bg-orange-600 text-white px-10 py-4 rounded-xl hover:bg-orange-700 transition font-medium"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">Your Cart ({totalItems()})</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="w-full sm:w-40 h-40 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-orange-600 font-bold mt-1">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-2 text-sm font-medium"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right min-w-[120px]">
                <p className="text-xl font-bold text-gray-900">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Subtotal</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-xl shadow-sm sticky top-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems()} items)</span>
                <span>₦{totalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Calculated at checkout</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₦{totalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link href="/checkout">
              <button className="w-full bg-orange-600 text-white py-5 rounded-xl mt-8 hover:bg-orange-700 transition font-bold text-lg">
                Proceed to Checkout
              </button>
            </Link>

            <p className="text-center text-sm text-gray-500 mt-4">
              Secure checkout • Free shipping on orders over ₦50,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}