export interface MonthlyData {
  _id: {
    year: number;
    month: number;
  };
  revenue?: number;
  count: number;
}

export interface StatusDistribution {
  _id: string;
  count: number;
}

export interface TopBook {
  _id: string;
  title: string;
  totalSold: number;
  revenue: number;
}

export interface TopAuthor {
  _id: string;
  authorName: string;
  totalSold: number;
  booksCount: number;
}

export interface PaymentMethodData {
  _id: string;
  count: number;
  revenue: number;
}

export interface DashboardStats {
  overview: {
    totalBooks: number;
    totalUsers: number;
    totalAuthors: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  };
  recentActivity: {
    recentOrders: unknown[];
    recentUsers: unknown[];
    recentBooks: unknown[];
  };
  charts: {
    monthlyRevenue: MonthlyData[];
    orderStatusDistribution: StatusDistribution[];
    topBooks: TopBook[];
    topAuthors: TopAuthor[];
    userGrowth: MonthlyData[];
    paymentMethodDistribution: PaymentMethodData[];
  };
}
