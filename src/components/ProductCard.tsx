import { Edit, Trash2, Package, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
    status: 'active' | 'draft' | 'low_stock';
    sales?: number;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  const statusBadge = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    low_stock: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${statusBadge[product.status]}`}>
          {product.status === 'low_stock' ? 'Low Stock' : product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-medium line-clamp-2">{product.name}</h3>
        <p className="text-orange-600 font-bold mt-1">₦{product.price.toLocaleString()}</p>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Package size={16} />
            <span>{product.stock} in stock</span>
          </div>
          {product.sales !== undefined && (
            <span>{product.sales} sold</span>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {onEdit && (
            <button
              onClick={() => onEdit(product.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            >
              <Edit size={16} /> Edit
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(product.id)}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Eye size={16} /> View
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}