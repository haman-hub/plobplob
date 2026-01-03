import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';
import { SortOption } from '../../types';

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'ebooks', name: 'eBooks' },
  { id: 'tutorials', name: 'Tutorials' },
  { id: 'assets', name: 'Digital Assets' },
  { id: 'software', name: 'Software' },
  { id: 'courses', name: 'Courses' },
];

const SORT_OPTIONS = [
  { id: 'newest' as SortOption, name: 'Newest', icon: Clock },
  { id: 'price-asc' as SortOption, name: 'Price: Low to High', icon: DollarSign },
  { id: 'price-desc' as SortOption, name: 'Price: High to Low', icon: DollarSign },
  { id: 'rating-desc' as SortOption, name: 'Top Rated', icon: TrendingUp },
];

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const products = useMemo(() => {
    return mockDB.getProducts({
      category: category === 'all' ? undefined : category,
      search: search || undefined,
      sort: sortBy
    });
  }, [search, category, sortBy]);

  const user = mockDB.getCurrentUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <div className="text-sm text-gray-600">
            Balance: <span className="font-bold text-[#0088cc]">{user?.balance.toFixed(2)} TON</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-[#0088cc] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Button */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Sort by: {SORT_OPTIONS.find(s => s.id === sortBy)?.name}</span>
          </button>

          {showSortMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 animate-fadeIn">
              {SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setShowSortMenu(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      sortBy === option.id ? 'text-[#0088cc]' : 'text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try different search terms or categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Product Image Placeholder */}
              <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <div className="text-[#0088cc]">
                  <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold">{product.category.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-xs text-gray-600 truncate mt-1">{product.description}</p>
                
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="text-lg font-bold text-[#0088cc]">
                      {product.price.toFixed(2)} TON
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">
                        {product.averageRating.toFixed(1)} • {product.totalSales} sold
                      </span>
                    </div>
                  </div>
                  <button className="bg-[#0088cc] text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <span className="text-xs font-semibold">Buy</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0088cc]">{products.length}</div>
            <div className="text-sm text-gray-600">Active Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {products.reduce((sum, p) => sum + p.totalSales, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;