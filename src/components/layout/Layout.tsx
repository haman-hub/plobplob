import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Removed Outlet
import { 
  Home, ShoppingBag, User, Wallet, LogOut, 
  Menu, X, BarChart, Package
} from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const user = mockDB.getCurrentUser();

  const navItems = [
    { path: '/marketplace', icon: Home, label: 'Marketplace' },
    { path: '/profile', icon: User, label: 'Profile' },
    ...(user?.role === 'SELLER' || user?.role === 'ADMIN' ? [
      { path: '/seller/dashboard', icon: BarChart, label: 'Seller Dashboard' },
      { path: '/seller/create-product', icon: Package, label: 'Create Product' },
      { path: '/seller/wallet', icon: Wallet, label: 'Wallet' },
    ] : []),
  ];

  const handleLogout = () => {
    mockDB.setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="font-bold text-lg text-gray-900">TON Marketplace</h1>
              {user && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    user.role === 'ADMIN' ? 'bg-purple-500' :
                    user.role === 'SELLER' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {user.username} • {user.balance.toFixed(2)} TON
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {user?.walletAddress && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Wallet Connected</span>
            </div>
          )}
        </div>
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0088cc] to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user?.username}</h2>
                  <p className="text-sm text-gray-600 capitalize">{user?.role.toLowerCase()}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-[#0088cc] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
        <div className="flex justify-around">
          {navItems.slice(0, 4).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'text-[#0088cc]'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
