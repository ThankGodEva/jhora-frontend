'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Package, MapPin, Mail, Phone, Share2 } from 'lucide-react';
import api from '@/lib/api';

interface Vendor {
  id: number;
  shop_name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  products_count: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  is_featured: boolean;
}

export default function VendorStorefront() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchVendor = async () => {
      try {
        // Fetch vendor details
        const vendorRes = await api.get(`/icreators/${slug}`);
        setVendor(vendorRes.data);

        // Fetch products from this vendor
        const productsRes = await api.get(`/icreators/${slug}/products`);
        setProducts(productsRes.data || []);
      } catch (err) {
        console.error('Failed to load vendor/shop', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading shop...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Shop not found</h1>
          <Link href="/" className="text-orange-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner & Header */}
      <div className="relative">
        <img
          src={vendor.banner || 'https://via.placeholder.com/1200x400/FF6200/FFFFFF?text=Shop+Banner'}
          alt={vendor.shop_name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={vendor.logo || 'https://via.placeholder.com/160/FFFFFF/FF6200?text=' + vendor.shop_name[0]}
                alt={vendor.shop_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold">{vendor.shop_name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(vendor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className="text-lg">{vendor.rating} • {vendor.products_count} products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Contact */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About {vendor.shop_name}</h2>
            <p className="text-gray-700 leading-relaxed">{vendor.description || 'No description available yet.'}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h3 className="font-semibold text-lg mb-4">Contact Shop</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-gray-600" />
                <span className="text-gray-700">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-600" />
                <a href="mailto:hello@tenibags.com" className="text-orange-600 hover:underline">
                  hello@tenibags.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-gray-600" />
                <a href="tel:+2348024468093" className="text-orange-600 hover:underline">
                  +234 802 446 8093
                </a>
              </div>
              <button className="w-full mt-4 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition">
                Message Shop
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">All Products</h2>

          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              No products available yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id}>
                  <div className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2">{product.name}</h3>
                      <p className="text-orange-600 font-bold mt-1">{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}