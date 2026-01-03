import React from 'react';
import { Navigate } from 'react-router-dom';
import { mockDB } from '../../services/mockDatabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const user = mockDB.getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/marketplace" replace />;
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⛔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Account Banned</h2>
          <p className="text-gray-600 mb-6">
            Your account has been suspended due to violations of our terms of service.
          </p>
          <button
            onClick={() => {
              mockDB.setCurrentUser(null);
              window.location.href = '/';
            }}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;