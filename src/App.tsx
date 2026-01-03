import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTelegram } from './hooks/useTelegram';
import { mockDB } from './services/mockDatabase';
import { User } from './types';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Components
import WelcomeScreen from './components/auth/WelcomeScreen';

// Buyer Components
import Marketplace from './components/buyer/Marketplace';
import ProductDetail from './components/buyer/ProductDetail';
import BuyerProfile from './components/buyer/BuyerProfile';

// Seller Components
import SellerDashboard from './components/seller/SellerDashboard';
import CreateProduct from './components/seller/CreateProduct';
import SellerWallet from './components/seller/SellerWallet';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Shared Components
import WalletConnect from './components/shared/WalletConnect';

function App() {
  const { isInitialized } = useTelegram();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const currentUser = mockDB.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088cc] mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing Telegram App...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/marketplace" /> : <WelcomeScreen />} />
        <Route path="/wallet-connect" element={<WalletConnect />} />
        
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Buyer Routes */}
        <Route path="/marketplace" element={
          <ProtectedRoute allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
            <Layout>
              <Marketplace />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={
          <ProtectedRoute allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
            <Layout>
              <ProductDetail />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
            <Layout>
              <BuyerProfile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
            <Layout>
              <SellerDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/seller/create-product" element={
          <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
            <Layout>
              <CreateProduct />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/seller/wallet" element={
          <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
            <Layout>
              <SellerWallet />
            </Layout>
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;