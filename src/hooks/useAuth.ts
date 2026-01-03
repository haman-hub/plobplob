import { useEffect, useState } from 'react';
import { mockDB } from '../services/mockDatabase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = mockDB.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (userId: string) => {
    mockDB.setCurrentUser(userId);
    const currentUser = mockDB.getCurrentUser();
    setUser(currentUser);
  };

  const logout = () => {
    mockDB.setCurrentUser(null);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = mockDB.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isSeller: user?.role === 'SELLER',
    isBuyer: user?.role === 'BUYER'
  };
};