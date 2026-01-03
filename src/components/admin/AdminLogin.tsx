import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin password - in production, this should be in .env
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tonmarketplace2024';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Create admin session
        localStorage.setItem('admin-authenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid admin password');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">TON Marketplace Administration</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 flex items-start space-x-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-300">Authentication Failed</h4>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Admin Dashboard'
              )}
            </button>
          </form>

          {/* Back Button */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-400 hover:text-white py-3 rounded-xl font-medium hover:bg-gray-700/50 transition-all"
            >
              ← Back to Marketplace
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">
                This area is restricted to authorized administrators only. 
                Unauthorized access attempts are logged and may result in legal action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;