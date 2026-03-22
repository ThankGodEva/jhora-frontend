'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { Heart } from 'lucide-react';

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
      {/* HERO BANNER - Updated with your image */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Your image as background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/images/hero-background.jpg')" 
          }}
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative text-center px-6 max-w-4xl z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Discover Products From<br />Different iCreators
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-lg mx-auto">
            Authentic, handmade treasures from Nigeria's most creative minds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-orange-600 text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-orange-700 transition inline-block"
            >
              Start shopping
            </Link>
            <Link
              href="/become-icreator"
              className="border-2 border-white text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-white hover:text-black transition inline-block"
            >
              Become an iCreator
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-left mb-5">Featured Products</h2>
          <p className="text-xl text-300 max-w-3xl mb-10">
              Discover authentic products made by local creators representing Nigeria's rich culture
          </p>

          {loading ? (
            <div className="text-center py-12">Loading featured products...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition relative">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                    
                    {/* Wishlist icon */}
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-50 transition">
                      <Heart size={20} className="text-gray-700 hover:text-red-500" />
                    </button>

                    <div className="p-4">
                      <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
                      <p className="text-orange-600 font-bold mt-1">{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SHOWCASE, RUN AND SCALE AS AN iCREATOR */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Showcase, Run and Scale as an iCreator</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "For small local brands",
                desc: "We promote visibility for creators at any stage in their business.",
                icon: "🌱",
              },
              {
                title: "Encourage local arts",
                desc: "We promote visibility for creators at any stage in their business.",
                icon: "🎨",
              },
              {
                title: "Encourage local arts",
                desc: "We promote visibility for creators at any stage in their business.",
                icon: "🌍",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl text-center shadow hover:shadow-xl transition">
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
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
              !Creator of the Month
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

      {/* LET OTHERS KNOW */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">You've got the product, let others know</h2>
          <Link href="/@tenibags" className="mt-6 inline-block bg-orange-600 text-white px-10 py-3 rounded-full hover:bg-orange-700 transition">
            Start selling
          </Link>
        </div>
      </section>

      {/* iCREATORS PROMOTING THE CULTURE */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">iCreators promoting the culture</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Nol Astler', 'Ori & Thread', 'Savanna Soles', 'Río Fila'].map((name, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-orange-200">
                  <img src={`https://via.placeholder.com/150/FF6200/FFFFFF?text=${name[0]}`} alt={name} className="w-full h-full object-cover" />
                </div>
                <p className="font-medium mt-4">{name}</p>
              </div>
            ))}
          </div>
          <div className='mt-10 mx-auto py-3 px-2 text-center'>
            <Link href="/@tenibags" className="mt-8 px-8 py-4 rounded-full overflow-hidden border-4 border-black-200">
              Explore iCreators
            </Link>
          </div>
        </div>
      </section>

      {/* iCREATE, DISPLAY, SELL */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">iCreate, Display, Sell</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[ 
              { step: "1", title: "Create shop profile", desc: "It's simple, open a sellers account, list and publish items." },
              { step: "2", title: "List your products", desc: "We promote visibility for creators at any stage in their business." },
              { step: "3", title: "Sell & get paid", desc: "You get paid for your creations." },
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-3xl text-center shadow hover:shadow-xl transition">
                <div className="text-5xl font-bold text-orange-600 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Collection Teaser */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Shop By Collection
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

      {/* Start Selling */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button className="bg-orange-600 text-white px-8 py-4 text-lg rounded-full hover:bg-orange-700">
            Start selling
          </button>
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

    </Layout>
  );
}