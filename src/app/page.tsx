'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface FeaturedProduct {
  id: number;
  name: string;
  slug?: string;         // optional – add if you have it
  price: string;
  compare_price?: string;
  image: string;
  vendor: string;
  rating?: number;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;          // optional (might not always have one)
  slug: string;
  vendor?: {
    shop_name: string;
  };
  // add more fields later if needed, e.g. colors: string[], etc.
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products/featured');
        setFeaturedProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load featured products', err);
        // Optional fallback dummy data if API fails
        setFeaturedProducts([
          { id: 1, name: 'T-Mank Mini Bag', price: '₦48,000', image: 'https://via.placeholder.com/300', vendor: 'Tenibags' },
          // ... more
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Products From Different Creators
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Authentic handmade items made by local Nigerian creators representing Nigeria's rich culture
          </p>
          <button className="bg-white text-orange-600 px-10 py-5 text-xl font-bold rounded-full hover:bg-gray-100 transition shadow-lg">
            Start Shopping
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">Loading featured items...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No featured products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link 
                  href={`/product/${product.slug}`} 
                  key={product.id}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-orange-600">
                      {product.name}
                    </h3>
                    <p className="text-orange-600 font-bold mt-1">{product.price}</p>
                    {product.compare_price && (
                      <p className="text-sm text-gray-500 line-through">{product.compare_price}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      by {product.vendor}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Shop By Category
          </h2>

          <div className="
            flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide
            lg:grid lg:grid-cols-6 lg:overflow-x-visible lg:pb-0 lg:snap-none lg:gap-6
          ">
            {[
              {
                name: "Bags",
                count: "1,248",
                image: "https://via.placeholder.com/200x200/FF6200/FFFFFF?text=Bags",
                slug: "bags",
              },
              {
                name: "Shoes",
                count: "842",
                image: "https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Shoes",
                slug: "shoes",
              },
              {
                name: "Jewelry",
                count: "673",
                image: "https://via.placeholder.com/200x200/C0C0C0/000000?text=Jewelry",
                slug: "jewelry",
              },
              {
                name: "Interior Decor",
                count: "512",
                image: "https://via.placeholder.com/200x200/FFD700/000000?text=Interior",
                slug: "interior-decor",
              },
              {
                name: "Fashion",
                count: "1,105",
                image: "https://via.placeholder.com/200x200/FF4500/FFFFFF?text=Fashion",
                slug: "fashion",
              },
              {
                name: "Art & Collectibles",
                count: "389",
                image: "https://via.placeholder.com/200x200/4B0082/FFFFFF?text=Art",
                slug: "art-collectibles",
              },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="
                  group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300

                  flex-none w-44 snap-center               /* only matters when flex/scroll is active */
                  lg:w-auto lg:snap-none                   /* reset on large screens so grid works normally */
                "
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {category.count} items
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-medium text-lg transition shadow-lg">
              View All Categories
            </button>
          </div>
        </div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Creator of the Month
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Spotlight on the creator of the month – combining independence and locality
            </p>
          </div>

          {/* Featured Creator Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="md:flex">
              {/* Left – Image */}
              <div className="md:w-1/2">
                <img
                  src="https://via.placeholder.com/600x600/FF6200/FFFFFF?text=Tenibags"
                  alt="Tenibags Creator"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right – Info */}
              <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl">
                    T
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold">Tenibags</h3>
                    <p className="text-gray-600">@tenibags</p>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 font-medium">4.8</span>
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  Inspired by the energy of expression, Tenibags is designed for those who love style, strength, and intentionality – a perfect combination of form and function.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop/tenibags"
                    className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition"
                  >
                    Visit Shop
                  </Link>
                  <Link
                    href="/creators/tenibags"
                    className="border border-orange-600 text-orange-600 px-8 py-3 rounded-full font-medium hover:bg-orange-50 transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/creators"
              className="text-orange-600 hover:text-orange-800 font-medium text-lg inline-flex items-center"
            >
              Explore More Creators <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* iCreate, Display, Sell – How It Works - 3 Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            iCreate, Display, Sell
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Create profile",
                description: "Create shop profile for creators in any stage of their business. Feel seen, heard and patronized.",
                icon: "https://via.placeholder.com/80/FF6200/FFFFFF?text=1",
              },
              {
                step: "2",
                title: "List products",
                description: "List products for creators in any stage of their business. Feel seen, heard and patronized.",
                icon: "https://via.placeholder.com/80/FF6200/FFFFFF?text=2",
              },
              {
                step: "3",
                title: "Sell & get paid",
                description: "Sell paid for creators in any stage of their business. Feel seen, heard and patronized.",
                icon: "https://via.placeholder.com/80/FF6200/FFFFFF?text=3",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-3xl font-bold">
                  {item.step}
                </div>
                <img src={item.icon} alt="" className="w-20 h-20 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Collection Teaser */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Shop Collection
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://via.placeholder.com/300x400/FF6200/FFFFFF?text=Collection+1",
              "https://via.placeholder.com/300x400/8B4513/FFFFFF?text=Collection+2",
              "https://via.placeholder.com/300x400/C0C0C0/000000?text=Collection+3",
              "https://via.placeholder.com/300x400/FFD700/000000?text=Collection+4",
            ].map((img, i) => (
              <div key={i} className="aspect-[3/4] overflow-hidden rounded-xl shadow-md">
                <img src={img} alt={`Collection ${i+1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-orange-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-orange-700 transition">
              Explore Collections
            </button>
          </div>
        </div>
      </section>

      {/* The List Goes On - Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            The List Goes On
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Neu Atelier", followers: "12.4k", image: "https://via.placeholder.com/400x400/4B0082/FFFFFF?text=Neu" },
              { name: "Ori Thread", followers: "8.9k", image: "https://via.placeholder.com/400x400/FF4500/FFFFFF?text=Ori" },
              { name: "Savanna Soles", followers: "15.2k", image: "https://via.placeholder.com/400x400/228B22/FFFFFF?text=Savanna" },
            ].map((creator) => (
              <div key={creator.name} className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-orange-200">
                  <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{creator.name}</h3>
                <p className="text-gray-600 mb-4">{creator.followers} followers</p>
                <button className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition">
                  Explore Shop
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="border-2 border-orange-600 text-orange-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-orange-50 transition">
              View More Creators
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Questions Frequently Asked
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How can I become a Creator?",
                a: "It's very simple. Create an account, link your social platforms, upload items, and start selling. You can start from social platforms.",
              },
              {
                q: "How can I be an iCreator?",
                a: "Sign up, open a seller's account, upload wonderful items, and continue building your brand.",
              },
              {
                q: "How can I list an item?",
                a: "After creating your shop, go to dashboard → Products → Add New Item. Fill details, variants, description (use AI generator), and upload photos.",
              },
            ].map((item, i) => (
              <details key={i} className="bg-white rounded-xl shadow-sm">
                <summary className="flex justify-between items-center cursor-pointer p-6 text-xl font-medium">
                  {item.q}
                  <span className="text-orange-600 text-2xl">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-700">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder for more sections */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Shop By Category</h2>
          <p className="text-gray-600 mb-12">Coming soon – Bags, Jewelry, Fashion, Art & more...</p>
          
          <button className="bg-orange-600 text-white px-8 py-4 text-lg rounded-full hover:bg-orange-700">
            Explore iCreators
          </button>
        </div>
      </section>
    </Layout>
  );
}