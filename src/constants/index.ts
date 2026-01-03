export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Grid' },
  { id: 'ebooks', name: 'eBooks', icon: 'BookOpen' },
  { id: 'tutorials', name: 'Tutorials', icon: 'Video' },
  { id: 'assets', name: 'Digital Assets', icon: 'Image' },
  { id: 'software', name: 'Software', icon: 'Code' },
  { id: 'courses', name: 'Courses', icon: 'GraduationCap' },
  { id: 'music', name: 'Music', icon: 'Music' },
  { id: 'art', name: 'Digital Art', icon: 'Palette' },
  { id: 'templates', name: 'Templates', icon: 'LayoutTemplate' },
];

export const SORT_OPTIONS = [
  { id: 'newest', name: 'Newest', field: 'createdAt', order: 'desc' },
  { id: 'price-asc', name: 'Price: Low to High', field: 'price', order: 'asc' },
  { id: 'price-desc', name: 'Price: High to Low', field: 'price', order: 'desc' },
  { id: 'rating-desc', name: 'Top Rated', field: 'averageRating', order: 'desc' },
  { id: 'sales-desc', name: 'Best Selling', field: 'totalSales', order: 'desc' },
];

export const REPORT_REASONS = [
  { id: 'SCAM', name: 'Scam/Fraud', description: 'Product is fake or misleading' },
  { id: 'SPAM', name: 'Spam', description: 'Unwanted or repetitive content' },
  { id: 'INAPPROPRIATE', name: 'Inappropriate Content', description: 'Contains offensive material' },
  { id: 'COPYRIGHT', name: 'Copyright Violation', description: 'Infringes on intellectual property' },
  { id: 'OTHER', name: 'Other', description: 'Other issues' },
];

export const TRANSACTION_FEE = 0.1; // 0.1 TON per transaction
export const WITHDRAWAL_FEE = 0.05; // 0.05 TON per withdrawal
export const MIN_WITHDRAWAL = 1; // Minimum 1 TON for withdrawal

export const DEMO_USERS = {
  buyer: {
    username: 'demo_buyer',
    balance: 100,
    role: 'BUYER' as const,
  },
  seller: {
    username: 'demo_seller',
    balance: 50,
    role: 'SELLER' as const,
  },
  admin: {
    username: 'demo_admin',
    balance: 1000,
    role: 'ADMIN' as const,
  }
};

export const PLATFORM_RULES = [
  'All digital goods must be delivered instantly after purchase',
  'No illegal, copyrighted, or harmful content allowed',
  'Sellers are responsible for product quality',
  'Refunds are handled on a case-by-case basis',
  'Platform fee of 0.1 TON applies to all purchases'
];