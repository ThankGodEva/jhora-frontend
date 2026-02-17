'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import api from '@/lib/api';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  vendor: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data || []);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error('Remove failed', err);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  if (loading) return <div className="p-10 text-center">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/" className="bg-orange-600 text-white px-10 py-4 rounded-full font-medium hover:bg-orange-700">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow p-6 flex gap-6">
                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">by {item.vendor}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 border rounded-full flex items-center justify-center">
                        <Minus size={16} />
                      </button>
                      <span className="font-medium w-10 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 border rounded-full flex items-center justify-center">
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-orange-600">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="mt-4 text-red-600 text-sm flex items-center gap-1 hover:text-red-800">
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-10">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Fee</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>Total</span>
                  <span className="text-orange-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full mt-8 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}