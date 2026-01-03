import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, Users, AlertCircle, Plus, Edit, Trash2, Shield, Star } from 'lucide-react'; // Added Star import
import { mockDB } from '../../services/mockDatabase';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  
  const user = mockDB.getCurrentUser();
  const products = mockDB.getProducts().filter(p => p.sellerId === user?.id);
  
  // Get purchases safely
  const purchases = user ? 
    Array.from((mockDB as any).data?.purchases?.values() || [])
      .filter((purchase: any) => {
        const product = mockDB.getProducts().find(p => p.id === purchase.productId);
        return product?.sellerId === user.id;
      }) : [];

  const totalRevenue = purchases.reduce((sum: number, p: any) => sum + p.pricePaid, 0);
  const totalSales = purchases.length;
  const averageRating = products.length > 0 
    ? products.reduce((sum, p) => sum + p.averageRating, 0) / products.length 
    : 0;

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In real implementation, you would mark as inactive
      alert('Product deletion would be implemented here');
    }
  };

  const requestVerification = () => {
    if (user) {
      mockDB.updateUser(user.id, { verificationStatus: 'PENDING' });
      setShowVerificationModal(false);
      alert('Verification request submitted!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <button
          onClick={() => navigate('/seller/create-product')}
          className="bg-gradient-to-r from-[#0088cc] to-blue-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Verification Status */}
      {user?.verificationStatus === 'PENDING' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Verification Pending</h3>
            <p className="text-sm text-blue-700">Your verification request is under review</p>
          </div>
        </div>
      )}

      {user?.verificationStatus === 'REJECTED' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-900">Verification Rejected</h3>
                <p className="text-sm text-amber-700">You can reapply after 30 days</p>
              </div>
            </div>
            <button
              onClick={() => setShowVerificationModal(true)}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              Reapply
            </button>
          </div>
        </div>
      )}

      {user?.verificationStatus !== 'VERIFIED' && user?.verificationStatus !== 'PENDING' && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-[#0088cc]" />
              <div>
                <h3 className="font-semibold text-gray-900">Get Verified</h3>
                <p className="text-sm text-gray-600">Increase trust and sales with a verified badge</p>
              </div>
            </div>
            <button
              onClick={() => setShowVerificationModal(true)}
              className="bg-[#0088cc] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(2)} TON</div>
          <div className="text-sm text-gray-600">Revenue</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalSales}</div>
          <div className="text-sm text-gray-600">Sales</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-gray-500">Avg</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Rating</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          <div className="text-sm text-gray-600">Products</div>
        </div>
      </div>

      {/* Products List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Products</h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Create your first product to start selling</p>
            <button
              onClick={() => navigate('/seller/create-product')}
              className="bg-[#0088cc] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
            >
              Create Product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center text-sm">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span>{product.averageRating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{product.totalSales} sales</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm font-medium text-[#0088cc]">{product.price} TON</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/seller/create-product?edit=${product.id}`)}
                      className="p-2 text-gray-500 hover:text-[#0088cc] hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Sales */}
      {purchases.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {purchases.slice(0, 5).map((purchase: any, index: number) => {
              const product = mockDB.getProducts().find(p => p.id === purchase.productId);
              return (
                <div 
                  key={purchase.id} 
                  className={`p-4 ${index !== purchases.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{product?.title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0088cc]">{purchase.pricePaid} TON</div>
                      <div className="text-xs text-gray-500">Net: {(purchase.pricePaid - 0.1).toFixed(2)} TON</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slideUp">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-[#0088cc]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Seller Verification</h3>
            <p className="text-gray-600 mb-6 text-center">
              Verified sellers receive a badge that increases buyer trust. 
              This process may take 2-3 business days.
            </p>
            <div className="space-y-3">
              <button
                onClick={requestVerification}
                className="w-full bg-gradient-to-r from-[#0088cc] to-blue-600 text-white py-3 rounded-xl font-medium hover:opacity-90"
              >
                Submit Verification Request
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
