'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_price?: string;
  stock_quantity: number;
  availability: string;
  images: string[];
  colors: string[];
  sizes: string[];
  vendor: { shop_name: string; slug: string };
  rating?: number;
  reviews_count?: number;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
        try {
        const res = await api.get(`/products/${slug}`);
        const data = res.data;

        const loadedProduct = {
            ...data,
            images: data.images || [data.image || 'https://via.placeholder.com/600'],
            colors: data.colors || [],
            sizes: data.sizes || ['One Size'],
            rating: data.rating || 4.8,
            reviews_count: data.reviews_count || 236,
        };

        setProduct(loadedProduct);

        // Auto-select first available color and size (THIS IS WHERE YOU PUT IT)
        if (loadedProduct.colors.length > 0 && !selectedColor) {
            setSelectedColor(loadedProduct.colors[0]);
        }
        if (loadedProduct.sizes.length > 0 && !selectedSize) {
            setSelectedSize(loadedProduct.sizes[0]);
        }
        } catch (err) {
        console.error('Failed to load product', err);
        } finally {
        setLoading(false);
        }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-orange-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-10">
      {/* Back button & share */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-700 hover:text-orange-600">
            <ChevronLeft size={24} className="mr-1" />
            Back
          </Link>
          <button className="text-gray-700 hover:text-orange-600">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="bg-white rounded-xl overflow-hidden shadow aspect-square">
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    currentImage === idx ? 'border-orange-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating || '4.8'} ({product.reviews_count || 236} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl md:text-5xl font-bold text-orange-600">{product.price}</span>
            {product.compare_price && (
              <span className="text-2xl text-gray-500 line-through">{product.compare_price}</span>
            )}
          </div>

          {/* Availability */}
          <p className={`font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'} ({product.stock_quantity} available)
          </p>

          {/* Variants */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition ${
                      selectedColor === color ? 'border-orange-600 scale-110 shadow-lg' : 'border-gray-300 hover:border-orange-400'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() === 'brown' ? '#8B4513' : color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border rounded-lg font-medium transition ${
                      selectedSize === size
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'border-gray-300 hover:border-orange-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 border rounded-full flex items-center justify-center text-xl hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-2xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 border rounded-full flex items-center justify-center text-xl hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
                onClick={async () => {
                    if (!selectedColor && product.colors.length > 0) {
                    alert('Please select a color');
                    return;
                    }
                    if (!selectedSize && product.sizes.length > 0) {
                    alert('Please select a size');
                    return;
                    }

                    try {
                    await api.post('/cart', {
                        product_id: product.id,
                        quantity,
                        // Optional: send selected variants
                        color: selectedColor,
                        size: selectedSize,
                    });
                    alert('Added to cart successfully!');
                    // Optional: redirect to cart
                    // router.push('/cart');
                    } catch (err) {
                    alert('Failed to add to cart. Please try again.');
                    }
                }}
                disabled={product.stock_quantity <= 0}
                className={`flex-1 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 ${
                    product.stock_quantity > 0
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                >
                <ShoppingCart size={20} />
                {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="flex-1 border border-orange-600 text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 transition">
              Add to Wishlist
            </button>
          </div>

          {/* Description */}
          <div className="pt-8 border-t">
            <h3 className="font-semibold text-xl mb-4">Product Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Seller Info */}
          <div className="pt-8 border-t">
            <h3 className="font-semibold text-xl mb-4">Sold by</h3>
            <Link href={`/icreators/${product.vendor.slug}`} className="flex items-center gap-4 hover:opacity-80 transition">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">
                {product.vendor.shop_name?.[0] || '?'}
              </div>
              <div>
                <p className="font-medium text-lg">{product.vendor.shop_name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  4.8 • Verified Seller
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* You May Also Like - stub */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Add 4 dummy or real related products here later */}
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow hover:shadow-xl transition">
                <img src="https://via.placeholder.com/300" alt="" className="w-full h-64 object-cover rounded-t-lg" />
                <div className="p-4">
                  <p className="font-medium">Similar Bag</p>
                  <p className="text-orange-600 font-bold">₦45,000</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}