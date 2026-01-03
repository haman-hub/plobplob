import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, FileText, Flag, Copy, Check, LogOut } from 'lucide-react'; // Removed Link
import { mockDB } from '../../services/mockDatabase';

const BuyerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'purchases' | 'reports'>('purchases');
  const [ratingProduct, setRatingProduct] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  const user = mockDB.getCurrentUser();
  
  // Get purchases safely
  const purchases = user ? 
    Array.from((mockDB as any).data?.purchases?.values() || [])
      .filter((p: any) => p.buyerId === user.id) : [];

  const handleLogout = () => {
    mockDB.setCurrentUser(null);
    navigate('/');
  };

  const handleRateProduct = (purchaseId: string) => { // Removed unused productId
    mockDB.ratePurchase(purchaseId, ratingValue);
    setRatingProduct(null);
    setRatingValue(5);
  };

  const copyLink = (link: string, purchaseId: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLinks({ ...copiedLinks, [purchaseId]: true });
    setTimeout(() => {
      setCopiedLinks({ ...copiedLinks, [purchaseId]: false });
    }, 2000);
  };

  const reportProduct = (productId: string) => {
    if (!user) return;
    
    const report = mockDB.createReport({
      productId,
      reporterId: user.id,
      reason: 'SCAM',
      description: 'User reported this product'
    });
    
    alert(`Report submitted successfully. Report ID: ${report.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0088cc] to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600 capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#0088cc]">{user?.balance.toFixed(2)}</div>
            <div className="text-sm text-gray-600">TON Balance</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{purchases.length}</div>
            <div className="text-sm text-gray-600">Purchases</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {purchases.filter((p: any) => p.userRating !== null).length}
            </div>
            <div className="text-sm text-gray-600">Rated Items</div>
          </div>
        </div>

        {/* Wallet Info */}
        {user?.walletAddress && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Wallet Address</span>
              <button
                onClick={() => copyLink(user.walletAddress!, 'wallet')}
                className="text-[#0088cc] hover:text-blue-700"
              >
                {copiedLinks['wallet'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
              {user.walletAddress}
            </code>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-white p-1 rounded-xl border border-gray-200">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'purchases'
              ? 'bg-[#0088cc] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 inline mr-2" />
          My Purchases
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'reports'
              ? 'bg-[#0088cc] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Flag className="w-4 h-4 inline mr-2" />
          Reports
        </button>
      </div>

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600 mb-6">Start exploring the marketplace!</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="bg-[#0088cc] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            purchases.map((purchase: any) => {
              const product = mockDB.getProducts().find(p => p.id === purchase.productId);
              return (
                <div key={purchase.id} className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product?.title}</h3>
                      <p className="text-sm text-gray-600">
                        Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#0088cc]">{purchase.pricePaid} TON</div>
                      <div className="text-xs text-gray-500">Fee: {purchase.adminFee} TON</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyLink(purchase.hiddenLink, purchase.id)}
                        className="flex items-center space-x-1 text-[#0088cc] hover:text-blue-700"
                      >
                        {copiedLinks[purchase.id] ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">Copy Link</span>
                      </button>
                      
                      {purchase.userRating === null ? (
                        <button
                          onClick={() => setRatingProduct(purchase.id)}
                          className="flex items-center space-x-1 text-amber-600 hover:text-amber-700"
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-sm">Rate</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 text-amber-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">Rated: {purchase.userRating}/5</span>
                        </div>
                      )}

                      <button
                        onClick={() => reportProduct(purchase.productId)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Flag className="w-4 h-4" />
                        <span className="text-sm">Report</span>
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/product/${purchase.productId}`)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      View Product
                    </button>
                  </div>

                  {/* Rating Modal */}
                  {ratingProduct === purchase.id && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-xl animate-fadeIn">
                      <h4 className="font-medium text-gray-900 mb-3">Rate this product</h4>
                      <div className="flex items-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRatingValue(star)}
                            className="text-2xl hover:scale-110 transition-transform"
                          >
                            {star <= ratingValue ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setRatingProduct(null)}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRateProduct(purchase.id)}
                          className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600"
                        >
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Report History</h3>
            <p className="text-gray-600 text-center mb-6">
              Your submitted reports will appear here
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
            >
              Browse Products to Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;
