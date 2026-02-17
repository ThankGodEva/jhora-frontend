'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, ChevronDown, Star, Heart } from 'lucide-react';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  creator: string;
  rating: number;
  colors: string[];
  availability: string;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (initialQuery) fetchResults(initialQuery);
  }, [initialQuery]);

  const fetchResults = async (searchTerm = query) => {
    setLoading(true);

    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    selectedColors.forEach(c => params.append('color', c));
    selectedGender.forEach(g => params.append('gender', g));
    selectedLifestyle.forEach(l => params.append('lifestyle', l));
    if (priceRange[0] > 0) params.set('min_price', priceRange[0].toString());
    if (priceRange[1] < 200000) params.set('max_price', priceRange[1].toString());
    selectedSizes.forEach(s => params.append('size', s));

    try {
      const res = await api.get(`/search?${params.toString()}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await api.get(`/suggestions?q=${encodeURIComponent(term)}`);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const applyFilters = () => {
    fetchResults(query);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedGender([]);
    setSelectedLifestyle([]);
    setPriceRange([0, 200000]);
    setSelectedSizes([]);
    setSortBy('relevance');
    fetchResults(query);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative search-container max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Explore products"
                className="w-full pl-12 pr-16 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                onFocus={() => setShowSuggestions(true)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                    fetchResults('');
                  }}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-700"
              >
                Search
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-6 py-3 hover:bg-orange-50 flex items-center transition"
                    onClick={() => {
                      setQuery(sug);
                      fetchResults(sug);
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                  >
                    <Search size={18} className="text-gray-400 mr-3" />
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && <p className="text-center text-xl py-20">Searching...</p>}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Sorry, we couldn't find a match</h2>
            <p className="text-gray-600 mb-8">
              Try checking your spelling or use more general terms
            </p>

            <div>
              <h3 className="text-xl font-semibold mb-6">You may also like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Dummy recommendations */}
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow">
                    <img src="https://via.placeholder.com/300" alt="" className="w-full h-64 object-cover rounded-t-lg" />
                    <div className="p-4">
                      <p className="font-medium">T-Mank Mini Bag</p>
                      <p className="text-orange-600 font-bold">₦48,000</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-2xl font-bold">
                Search results for <span className="text-orange-600">"{query}"</span>
              </h1>

              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      fetchResults(query);
                    }}
                    className="w-full sm:w-48 border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded hover:bg-gray-50 whitespace-nowrap"
                >
                  <SlidersHorizontal size={20} />
                  Filter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Filters – mobile modal, desktop sidebar */}
              <div className={`md:block ${showFilters ? 'fixed inset-0 z-50 bg-black/60 flex items-start justify-start' : 'hidden'}`}>
                <div className={`bg-white w-full max-w-md h-full md:h-auto md:w-auto md:relative md:shadow-none overflow-y-auto p-6 md:p-0 transition-transform ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                  {/* Mobile header */}
                  {showFilters && (
                    <div className="md:hidden flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold">Filters</h2>
                      <button onClick={() => setShowFilters(false)}>
                        <X size={32} />
                      </button>
                    </div>
                  )}

                  <div className="space-y-8">
                    {/* Color */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">COLOR</h3>
                      <div className="flex flex-wrap gap-3">
                        {['Black', 'Orange', 'Yellow', 'Green', 'Blue', 'Cyan', 'Brown'].map((c, i) => {
                          const colorMap: Record<string, string> = {
                            Black: '#000000', Orange: '#FF6200', Yellow: '#FFD700',
                            Green: '#228B22', Blue: '#0000FF', Cyan: '#00CED1', Brown: '#8B4513'
                          };
                          const isSelected = selectedColors.includes(c);
                          return (
                            <button
                              key={c}
                              className={`w-9 h-9 rounded-full border-2 transition ${isSelected ? 'border-orange-600 scale-110' : 'border-gray-200 hover:border-orange-400'}`}
                              style={{ backgroundColor: colorMap[c] }}
                              onClick={() => {
                                setSelectedColors(prev =>
                                  isSelected ? prev.filter(x => x !== c) : [...prev, c]
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">GENDER</h3>
                      <div className="space-y-3">
                        {['Female', 'Male', 'Unisex'].map(g => (
                          <label key={g} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedGender.includes(g)}
                              onChange={() => {
                                setSelectedGender(prev =>
                                  prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
                                );
                              }}
                              className="w-5 h-5 accent-orange-600 mr-3"
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Lifestyle */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">LIFESTYLE</h3>
                      <div className="space-y-3">
                        {['Casual', 'Work/Professional', 'Everyday'].map(l => (
                          <label key={l} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedLifestyle.includes(l)}
                              onChange={() => {
                                setSelectedLifestyle(prev =>
                                  prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
                                );
                              }}
                              className="w-5 h-5 accent-orange-600 mr-3"
                            />
                            {l}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">PRICE RANGE</h3>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="5000"
                          value={priceRange[1]}
                          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full accent-orange-600"
                        />
                      </div>
                      <div className="flex justify-between text-sm mt-2 text-gray-700">
                        <span>₦{priceRange[0].toLocaleString()}</span>
                        <span>₦{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4">SIZE</h3>
                      <div className="flex flex-wrap gap-3">
                        {['S', 'M', 'L', 'XL', 'XXL', 'One Size'].map(s => (
                          <button
                            key={s}
                            className={`px-4 py-2 border rounded-full text-sm transition ${
                              selectedSizes.includes(s)
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'border-gray-300 hover:border-orange-600'
                            }`}
                            onClick={() => {
                              setSelectedSizes(prev =>
                                prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                              );
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Apply / Reset */}
                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={applyFilters}
                        className="flex-1 bg-orange-600 text-white py-3.5 rounded-full font-medium hover:bg-orange-700 transition"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={resetFilters}
                        className="flex-1 border border-gray-400 py-3.5 rounded-full font-medium hover:bg-gray-50 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition group overflow-hidden">
                      <div className="relative aspect-square">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition">
                          <Heart size={20} className="text-gray-600 hover:text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-base line-clamp-2 group-hover:text-orange-600 transition">
                          {product.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          {product.oldPrice && (
                            <span className="text-gray-500 line-through mr-2">{product.oldPrice}</span>
                          )}
                          <span className="text-orange-600 font-bold">{product.price}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">by {product.creator}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}