import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

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
    recentOrders: any[];
    recentUsers: any[];
    recentBooks: any[];
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

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private readonly API_URL = "http://104.244.74.223:3000/api/v1/analytics";

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.isLoggedIn() ? this.auth.getToken() : null;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  getDashboardStats(): Observable<{ status: string; data: DashboardStats }> {
    return this.http.get<{ status: string; data: DashboardStats }>(
      `${this.API_URL}/dashboard`,
      { headers: this.getHeaders() }
    );
  }
}
