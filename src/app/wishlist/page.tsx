'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useWishlistStore } from '@/lib/wishlistStore';
import api from '@/lib/api';

export default function WishlistPage() {
  const router = useRouter();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(true);
  const [serverItems, setServerItems] = useState<any[]>([]);

  // Load wishlist from backend when logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        setServerItems(res.data || []);
      } catch (err) {
        console.error('Failed to load wishlist from server', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (id: number) => {
    // Remove from local store
    removeItem(id);

    // Remove from backend
    try {
      await api.delete(`/wishlist/${id}`);
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear entire wishlist?')) return;

    clearWishlist();

    try {
      await api.delete('/wishlist');
      toast.success('Wishlist cleared');
    } catch (err) {
      console.error(err);
    }
  };

  const displayedItems = serverItems.length > 0 ? serverItems : items;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading wishlist...</div>;
  }

  if (displayedItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <img src="/images/wishlist.png" alt="" className="w-60 h-70 mb-0 pb-0"/>
        
        <h2 className="text-3xl font-bold mb-3">You haven't saved an item yet!</h2>
        <div className="text-gray-600 mb-10">
            <p>
                Found something you like? Tap on the heart shaped icon in a product displayed and add it to your wishlist.
            </p>
            <p>✓ Use the heart icon to add or remove favorite.</p>
            <p>✓ All saved items will appear here.</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="bg-orange-600 text-white px-10 py-4 rounded-2xl hover:bg-orange-700"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <button
          onClick={handleClearAll}
          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
        >
          <Trash2 size={18} /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayedItems.map((item: any) => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm overflow-hidden group">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-4 right-4 bg-white p-3 rounded-2xl shadow hover:bg-red-50 transition"
              >
                <Trash2 size={20} className="text-red-600" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-xl line-clamp-2">{item.name}</h3>
              <p className="text-orange-600 font-bold text-2xl mt-2">
                ₦{item.price.toLocaleString()}
              </p>

              <button
                onClick={() => {
                  // Add to cart from wishlist
                  // You can expand this later
                  toast.success(`${item.name} added to cart!`);
                }}
                className="mt-6 w-full bg-orange-600 text-white py-4 rounded-2xl hover:bg-orange-700 transition font-medium flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}