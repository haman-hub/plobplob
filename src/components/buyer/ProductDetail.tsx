import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Package, User, AlertCircle, Copy, Check } from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = mockDB.getProducts().find(p => p.id === id);
  const user = mockDB.getCurrentUser();
  const seller = product ? mockDB.getCurrentUser()?.id === product.sellerId ? 
    mockDB.getCurrentUser() : 
    null : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-[#0088cc] hover:text-blue-700 font-medium"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    if (!user) {
      navigate('/');
      return;
    }

    if (!user.walletAddress) {
      navigate('/wallet-connect');
      return;
    }

    const totalCost = product.price + 0.1; // Price + fee
    if (user.balance < totalCost) {
      alert('Insufficient balance. Please add more TON.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmPurchase = () => {
    if (user) {
      const purchase = mockDB.purchaseProduct(user.id, product.id);
      if (purchase) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      }
    }
  };

  const copyLink = () => {
    if (product.hiddenLink) {
      navigator.clipboard.writeText(product.hiddenLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/80 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-[#0088cc]">
              {product.category.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600">{product.category}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{product.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{product.totalSales} sales</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#0088cc]">{product.price.toFixed(2)} TON</div>
            <div className="text-sm text-gray-500">+ 0.1 TON fee</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Seller Info */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#0088cc]" />
                </div>
                <div>
                  <div className="font-medium">{seller?.username || 'Seller'}</div>
                  <div className="flex items-center space-x-2 text-sm">
                    {seller?.verificationStatus === 'VERIFIED' && (
                      <>
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Verified Seller</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/profile/${seller?.id}`)}
                className="text-[#0088cc] hover:text-blue-700 text-sm font-medium"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={!user?.walletAddress}
          className="w-full mt-6 bg-gradient-to-r from-[#0088cc] to-blue-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!user?.walletAddress ? (
            'Connect Wallet to Purchase'
          ) : (
            <>
              <Package className="w-5 h-5 inline mr-2" />
              Purchase for {product.price + 0.1} TON
            </>
          )}
        </button>

        {/* Balance Info */}
        {user && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Your balance: <span className="font-semibold">{user.balance.toFixed(2)} TON</span>
          </div>
        )}
      </div>

      {/* Confirm Purchase Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slideUp">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Purchase</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{product.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-[#0088cc]">{product.price} TON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-medium">0.1 TON</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-gray-900 font-semibold">Total:</span>
                <span className="text-lg font-bold text-[#0088cc]">{product.price + 0.1} TON</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 bg-gradient-to-r from-[#0088cc] to-blue-600 text-white py-3 rounded-xl font-medium hover:opacity-90"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slideUp">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Purchase Successful!</h3>
            <p className="text-gray-600 text-center mb-6">
              Your purchase has been completed. You can now access the product.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Download Link:</span>
                <button
                  onClick={copyLink}
                  className="text-[#0088cc] hover:text-blue-700"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                {product.hiddenLink}
              </code>
            </div>

            <div className="space-y-3">
              <button
                onClick={copyLink}
                className="w-full border border-[#0088cc] text-[#0088cc] py-3 rounded-xl font-medium hover:bg-blue-50"
              >
                Copy Download Link
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/profile');
                }}
                className="w-full bg-gradient-to-r from-[#0088cc] to-blue-600 text-white py-3 rounded-xl font-medium hover:opacity-90"
              >
                Go to My Purchases
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;