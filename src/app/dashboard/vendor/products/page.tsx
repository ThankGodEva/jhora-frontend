'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';

// Define the type once (can be moved to types.ts later)
interface Product {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  image: string;
  status: 'active' | 'draft' | 'low_stock';
  sales?: number;
}

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]); // ← fixed
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vendor/products', {
        params: { status: statusFilter === 'all' ? null : statusFilter },
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    router.push('/dashboard/vendor/products/add');
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/vendor/products/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/vendor/products/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/vendor/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your inventory and listings</p>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border rounded-lg bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="low_stock">Low Stock</option>
          </select>
          <button className="px-4 py-3 border rounded-lg flex items-center gap-2">
            <Filter size={20} /> Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium">No products yet</h2>
          <p className="mt-2">Add your first product to start selling.</p>
          <button
            onClick={handleAddProduct}
            className="mt-6 bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}