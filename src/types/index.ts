export interface User {
  id: string;
  username: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  balance: number;
  walletAddress: string | null;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  hiddenLink: string;
  sellerId: string;
  averageRating: number;
  totalSales: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  buyerId: string;
  productId: string;
  pricePaid: number;
  adminFee: number;
  userRating: number | null;
  hiddenLink: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  productId: string;
  reporterId: string;
  reason: 'SCAM' | 'SPAM' | 'INAPPROPRIATE' | 'OTHER';
  description: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  sellerId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface DemoData {
  users: User[];
  products: Product[];
  purchases: Purchase[];
  reports: Report[];
  withdrawals: Withdrawal[];
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';