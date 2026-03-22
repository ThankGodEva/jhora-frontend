'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Plus, Minus, Star } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useWishlistStore } from '@/lib/wishlistStore';
import api from '@/lib/api';
import ProductHeader from '@/components/ProductHeader';  // ← import the new header
import Link from 'next/link';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { addItem: addToCart } = useCartStore();
  const { toggleItem: toggleWishlist, hasItem: isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        setProduct(res.data);
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size first');
      return;
    }

    addToCart({
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

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.stock_quantity || 10)) {
      setQuantity(newQty);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });

    const isWishlisted = isInWishlist(product.id);
    toast.success(isWishlisted ? 'Added to Wishlist ❤️' : 'Removed from Wishlist');
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    // For now, just show success (connect to backend later)
    toast.success('Thank you! Your review has been submitted.');
    setReviewText('');
    setReviewRating(5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <a href="/" className="text-orange-600 hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* New Header */}
      <ProductHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <img
                src={product.image || product.images?.[0]?.url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-auto aspect-square object-cover"
              />
            </div>

            {/* Thumbnail gallery */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img: any, idx: number) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition border-2 border-transparent hover:border-orange-500"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="space-y-8">
            {/* Vendor */}
            {product.vendor && (
              <Link
                href={`/@${product.vendor.slug}`}
                className="inline-flex items-center gap-2 text-orange-600 hover:underline"
              >
                <span className="font-medium">@{product.vendor.slug}</span>
                <span className="text-sm text-gray-500">Seller</span>
              </Link>
            )}

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

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
                <span className="text-gray-600 font-medium">
                  4.8 • 124 reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-orange-600">
                ₦{product.price.toLocaleString()}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ₦{product.compare_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variants - Colors */}
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor === color
                          ? 'border-orange-600 scale-110 shadow-md'
                          : 'border-gray-300 hover:border-orange-400'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Variants - Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 border rounded-lg text-sm font-medium transition ${
                        selectedSize === size
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-6 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border rounded-lg w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-8 py-3 font-medium min-w-[60px] text-center bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-600 text-white py-5 rounded-xl hover:bg-orange-700 transition font-bold text-lg flex items-center justify-center gap-3 shadow-md"
                >
                  <ShoppingCart size={24} />
                  Add to Cart
                </button>

                {/* Wishlist Button */}
                <button 
                  onClick={handleWishlistToggle}
                  className={`flex border-2 border-black-300 py-5 px-5 rounded-xl items-center gap-3 text-xl ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                >
                  <Heart size={24} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                  Add to Wishlist
                </button>
              </div>
            </div>

            {/* Tabs: Description, Shipping, Returns */}
            <div className="pt-8 border-t">
              <div className="flex border-b overflow-x-auto">
                <button className="px-6 py-3 font-medium border-b-2 border-orange-600 text-orange-600 whitespace-nowrap">
                  Description
                </button>
                <button className="px-6 py-3 font-medium text-gray-600 hover:text-orange-600 whitespace-nowrap">
                  Shipping
                </button>
                <button className="px-6 py-3 font-medium text-gray-600 hover:text-orange-600 whitespace-nowrap">
                  Returns
                </button>
              </div>

              <div className="py-6 prose max-w-none text-gray-700">
                <p>{product.description || 'No detailed description available yet.'}</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Made with premium, durable materials</li>
                  <li>Handcrafted with care</li>
                  <li>Fast shipping within Nigeria</li>
                  <li>30-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section - with padding */}
      <div className="mt-16 pt-12 border-t">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

        {/* Review Form - only for logged in users */}
        <div className="mb-12 bg-gray-50 p-8 rounded-2xl">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="flex gap-2 mb-4">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setReviewRating(star)}
                className={`text-3xl ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            className="w-full h-32 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSubmitReview}
            className="mt-4 bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700"
          >
            Submit Review
          </button>
        </div>

        {/* Existing reviews with padding */}
        <div className="space-y-8">
          {/* Sample reviews */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <p className="font-medium">Great quality bag! Very durable.</p>
            <div className="flex text-yellow-400 mt-2">★★★★☆</div>
            <p className="text-sm text-gray-500 mt-3">- Adewale O.</p>
          </div>
        </div>
      </div>

      {/* Related Products - with padding */}
      <div className="mt-16 pt-12 border-t">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Placeholder products */}
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <div className="h-52 bg-gray-200 rounded-xl mb-4" />
              <p className="font-medium">Related Product {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}