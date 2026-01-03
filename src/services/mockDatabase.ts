import { 
  User, Product, Purchase, Report, Withdrawal, 
  DemoData, SortOption 
} from '../types';

class MockDatabase {
  private static instance: MockDatabase;
  private storageKey = 'ton-marketplace-data';
  
  // Demo data for testing
  private demoData: DemoData = {
    users: [
      {
        id: 'user-1',
        username: 'alice_ton',
        role: 'BUYER',
        balance: 50,
        walletAddress: 'UQB1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJK',
        verificationStatus: 'VERIFIED',
        isBanned: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        username: 'bob_seller',
        role: 'SELLER',
        balance: 200,
        walletAddress: 'UQP0987654321zyxwvutsrqponmlkjihgfedcbaZYXWVUT',
        verificationStatus: 'PENDING',
        isBanned: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date()
      },
      {
        id: 'admin-1',
        username: 'admin',
        role: 'ADMIN',
        balance: 1000,
        walletAddress: 'UQAdminAddress1234567890abcdefghijklmnopqrstuvw',
        verificationStatus: 'VERIFIED',
        isBanned: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ],
    products: [
      {
        id: 'prod-1',
        title: 'React Advanced Patterns',
        description: 'Learn advanced React patterns and best practices',
        price: 15,
        category: 'ebooks',
        hiddenLink: 'https://drive.google.com/advanced-react-patterns',
        sellerId: 'user-2',
        averageRating: 4.8,
        totalSales: 42,
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date()
      },
      {
        id: 'prod-2',
        title: 'TON Smart Contract Guide',
        description: 'Complete guide to TON blockchain smart contracts',
        price: 25,
        category: 'tutorials',
        hiddenLink: 'https://drive.google.com/ton-smart-contracts',
        sellerId: 'user-2',
        averageRating: 4.9,
        totalSales: 28,
        isActive: true,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date()
      }
    ],
    purchases: [
      {
        id: 'purchase-1',
        buyerId: 'user-1',
        productId: 'prod-1',
        pricePaid: 15,
        adminFee: 0.1,
        userRating: 5,
        hiddenLink: 'https://drive.google.com/advanced-react-patterns',
        createdAt: new Date('2024-01-25')
      }
    ],
    reports: [],
    withdrawals: []
  };

  private data!: { // Added ! to indicate definite assignment
    users: Map<string, User>;
    products: Map<string, Product>;
    purchases: Map<string, Purchase>;
    reports: Map<string, Report>;
    withdrawals: Map<string, Withdrawal>;
    currentUser: string | null;
  };

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.data = {
          users: new Map(parsed.users?.map((u: User) => [u.id, { ...u, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) }]) || []),
          products: new Map(parsed.products?.map((p: Product) => [p.id, { ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) }]) || []),
          purchases: new Map(parsed.purchases?.map((p: Purchase) => [p.id, { ...p, createdAt: new Date(p.createdAt) }]) || []),
          reports: new Map(parsed.reports?.map((r: Report) => [r.id, { ...r, createdAt: new Date(r.createdAt) }]) || []),
          withdrawals: new Map(parsed.withdrawals?.map((w: Withdrawal) => [w.id, { ...w, createdAt: new Date(w.createdAt) }]) || []),
          currentUser: parsed.currentUser || null
        };
      } catch (error) {
        console.error('Error loading from storage:', error);
        this.resetToDemo();
      }
    } else {
      this.resetToDemo();
    }
  }

  private saveToStorage() {
    const data = {
      users: Array.from(this.data.users.values()),
      products: Array.from(this.data.products.values()),
      purchases: Array.from(this.data.purchases.values()),
      reports: Array.from(this.data.reports.values()),
      withdrawals: Array.from(this.data.withdrawals.values()),
      currentUser: this.data.currentUser
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  resetToDemo() {
    this.data = {
      users: new Map(this.demoData.users.map(u => [u.id, u])),
      products: new Map(this.demoData.products.map(p => [p.id, p])),
      purchases: new Map(this.demoData.purchases.map(p => [p.id, p])),
      reports: new Map(this.demoData.reports.map(r => [r.id, r])),
      withdrawals: new Map(this.demoData.withdrawals.map(w => [w.id, w])),
      currentUser: 'user-1'
    };
    this.saveToStorage();
  }

  clearAll() {
    this.data = {
      users: new Map(),
      products: new Map(),
      purchases: new Map(),
      reports: new Map(),
      withdrawals: new Map(),
      currentUser: null
    };
    this.saveToStorage();
  }

  // User Methods
  getCurrentUser(): User | null {
    if (!this.data.currentUser) return null;
    return this.data.users.get(this.data.currentUser) || null;
  }

  setCurrentUser(userId: string | null) {
    this.data.currentUser = userId;
    this.saveToStorage();
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = `user-${Date.now()}`;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.users.set(id, newUser);
    this.saveToStorage();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.data.users.get(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    this.data.users.set(id, updatedUser);
    this.saveToStorage();
    return updatedUser;
  }

  // Product Methods
  getProducts(filters?: {
    category?: string;
    search?: string;
    sort?: SortOption;
  }): Product[] {
    let products = Array.from(this.data.products.values())
      .filter(p => p.isActive);

    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
          products.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'newest':
          products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }

    return products;
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalSales' | 'isActive'> & { isActive?: boolean }): Product {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...product,
      id,
      averageRating: 0,
      totalSales: 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.products.set(id, newProduct);
    this.saveToStorage();
    return newProduct;
  }

  // Purchase Methods
  purchaseProduct(buyerId: string, productId: string): Purchase | null {
    const buyer = this.data.users.get(buyerId);
    const product = this.data.products.get(productId);
    const seller = product ? this.data.users.get(product.sellerId) : null;

    if (!buyer || !product || !seller) return null;

    const adminFee = 0.1;
    const totalCost = product.price + adminFee;

    if (buyer.balance < totalCost) return null;

    // Update balances
    buyer.balance -= totalCost;
    seller.balance += product.price;
    
    // Admin gets fee (find admin user)
    const admin = Array.from(this.data.users.values()).find(u => u.role === 'ADMIN');
    if (admin) {
      admin.balance += adminFee;
      this.data.users.set(admin.id, admin);
    }

    this.data.users.set(buyerId, buyer);
    this.data.users.set(seller.id, seller);

    // Update product sales
    product.totalSales += 1;
    product.updatedAt = new Date();
    this.data.products.set(productId, product);

    // Create purchase record
    const purchase: Purchase = {
      id: `purchase-${Date.now()}`,
      buyerId,
      productId,
      pricePaid: product.price,
      adminFee,
      userRating: null,
      hiddenLink: product.hiddenLink,
      createdAt: new Date()
    };

    this.data.purchases.set(purchase.id, purchase);
    this.saveToStorage();
    return purchase;
  }

  ratePurchase(purchaseId: string, rating: number): Purchase | null {
    const purchase = this.data.purchases.get(purchaseId);
    if (!purchase) return null;

    purchase.userRating = rating;
    this.data.purchases.set(purchaseId, purchase);

    // Update product average rating
    const product = this.data.products.get(purchase.productId);
    if (product) {
      const purchasesForProduct = Array.from(this.data.purchases.values()) // Fixed typo: purchages -> purchasesForProduct
        .filter(p => p.productId === purchase.productId && p.userRating !== null);
      
      if (purchasesForProduct.length > 0) {
        const totalRating = purchasesForProduct.reduce((sum, p) => sum + (p.userRating || 0), 0);
        product.averageRating = totalRating / purchasesForProduct.length;
        product.updatedAt = new Date();
        this.data.products.set(product.id, product);
      }
    }

    this.saveToStorage();
    return purchase;
  }

  // Report Methods
  createReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
    const id = `report-${Date.now()}`;
    const newReport: Report = {
      ...report,
      id,
      status: 'PENDING',
      createdAt: new Date()
    };
    this.data.reports.set(id, newReport);
    this.saveToStorage();
    return newReport;
  }

  // Withdrawal Methods
  requestWithdrawal(sellerId: string, amount: number): Withdrawal | null {
    const seller = this.data.users.get(sellerId);
    if (!seller || seller.balance < amount) return null;

    seller.balance -= amount;
    this.data.users.set(sellerId, seller);

    const withdrawal: Withdrawal = {
      id: `withdrawal-${Date.now()}`,
      sellerId,
      amount,
      status: 'PENDING',
      createdAt: new Date()
    };

    this.data.withdrawals.set(withdrawal.id, withdrawal);
    this.saveToStorage();
    return withdrawal;
  }

  // Admin Methods
  banUser(userId: string): User | null {
    const user = this.data.users.get(userId);
    if (!user) return null;

    user.isBanned = true;
    this.data.users.set(userId, user);

    // Deactivate user's products
    Array.from(this.data.products.values())
      .filter(p => p.sellerId === userId)
      .forEach(p => {
        p.isActive = false;
        this.data.products.set(p.id, p);
      });

    this.saveToStorage();
    return user;
  }

  approveWithdrawal(withdrawalId: string): Withdrawal | null {
    const withdrawal = this.data.withdrawals.get(withdrawalId);
    if (!withdrawal) return null;

    withdrawal.status = 'APPROVED';
    this.data.withdrawals.set(withdrawalId, withdrawal);
    this.saveToStorage();
    return withdrawal;
  }

  // Getters for admin dashboard
  getStats() {
    const users = Array.from(this.data.users.values());
    const purchases = Array.from(this.data.purchases.values());
    
    const totalReports = Array.from(this.data.reports.values());
    const totalWithdrawals = Array.from(this.data.withdrawals.values());
    
    return {
      totalUsers: users.length,
      totalVolume: purchases.reduce((sum, p) => sum + p.pricePaid, 0),
      totalSales: purchases.length,
      pendingReports: totalReports.filter(r => r.status === 'PENDING').length,
      pendingWithdrawals: totalWithdrawals.filter(w => w.status === 'PENDING').length
    };
  }
}

export const mockDB = MockDatabase.getInstance();
