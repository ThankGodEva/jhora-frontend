'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Plus, Minus, Star } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
      } catch (err: any) {
        console.error('Failed to load product', err);
        setError('Product not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= 10) { // limit to 10 for now
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Optional: check if logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart', {
        duration: 4000,
      });
      router.push('/login');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image || product.images?.[0]?.url || '/placeholder.jpg',
      vendor_slug: product.vendor?.slug,
    });

    toast.success(`Added ${quantity} × ${product.name} to cart! 🛒`, {
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'Sorry, we couldn\'t find this product.'}</p>
          <a
            href="/"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={product.image || product.images?.[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
          {/* Thumbnail gallery - optional */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: any, idx: number) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${product.name} - ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {product.vendor && (
              <Link
                href={`/@${product.vendor.slug}`}
                className="text-orange-600 hover:underline inline-block mb-4"
              >
                @{product.vendor.slug}
              </Link>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.8 • 124 reviews)</span>
            </div>

            <p className="text-4xl font-bold text-orange-600 mb-2">
              ₦{product.price.toLocaleString()}
            </p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="text-lg text-gray-500 line-through">
                ₦{product.compare_price.toLocaleString()}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none text-gray-700">
            <p>{product.description || 'No description available yet.'}</p>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-6 pt-6 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center border rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-4 py-3 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  <Minus size={18} />
                </button>
                <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-100 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 text-white py-5 rounded-xl hover:bg-orange-700 transition font-bold text-lg flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>

              <button className="flex-1 border-2 border-gray-300 py-5 rounded-xl hover:bg-gray-50 transition font-bold text-lg flex items-center justify-center gap-3">
                <Heart size={24} />
                Add to Wishlist
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t text-sm text-gray-600">
            <div>
              <p><strong>Category:</strong> {product.category || 'Fashion'}</p>
              <p><strong>Stock:</strong> {product.stock_quantity || 'In stock'}</p>
            </div>
            <div>
              <p><strong>Shipping:</strong> Free on orders over ₦50,000</p>
              <p><strong>Delivery:</strong> 2–5 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}