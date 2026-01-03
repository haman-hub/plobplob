import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, Shield, Zap, Download, UserPlus } from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartFresh = () => {
    setIsLoading(true);
    // Create a new user
    const newUser = mockDB.createUser({
      username: `user_${Math.random().toString(36).substr(2, 5)}`,
      role: 'BUYER',
      balance: 0,
      walletAddress: null,
      verificationStatus: 'PENDING',
      isBanned: false
    });
    
    mockDB.setCurrentUser(newUser.id);
    setTimeout(() => {
      navigate('/wallet-connect');
    }, 500);
  };

  const handleDemoMode = () => {
    setIsLoading(true);
    mockDB.resetToDemo();
    setTimeout(() => {
      navigate('/marketplace');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0088cc] to-blue-900 text-white p-6">
      <div className="max-w-md mx-auto pt-12">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">TON Marketplace</h1>
          <p className="text-blue-100">Buy & sell digital goods with TON</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl">
            <Shield className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Secure & Decentralized</h3>
              <p className="text-sm text-blue-100">Powered by TON Blockchain</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl">
            <Zap className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Instant Delivery</h3>
              <p className="text-sm text-blue-100">Auto-delivered after purchase</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl">
            <Users className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Verified Sellers</h3>
              <p className="text-sm text-blue-100">Trusted community members</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleDemoMode}
            disabled={isLoading}
            className="w-full bg-white text-[#0088cc] py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-blue-50 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0088cc]"></div>
                <span>Loading Demo...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Load Demo Mode</span>
              </>
            )}
          </button>

          <button
            onClick={handleStartFresh}
            disabled={isLoading}
            className="w-full bg-transparent border-2 border-white text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Start Fresh Account</span>
              </>
            )}
          </button>
        </div>

        {/* Admin Access */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <button
            onClick={() => navigate('/admin-login')}
            className="text-center w-full text-blue-200 hover:text-white transition-colors"
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;