import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  //API
  private endPoint: string = "http://localhost:3000/api/v1/orders";

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getClient(): string[] {
    const JWT_Token = this.auth.isLoggedIn() ? this.auth.getToken() : null;
    const clientHeader: string[] = ["Authorization", `Bearer ${JWT_Token}`]
    return clientHeader;
  }

  /**
 * Place an order
 * @param paymentMethod 'cash' | 'paymob'
 * @returns Observable with order data
 */
  placeOrder(paymentMethod: string): Observable<any> {
    const client: string[] = this.getClient();
    return this.http.post(
      `${this.endPoint}`,
      { paymentMethod },
      {
        headers: {
          [client[0]]: client[1],
        },
      }
    );
  }


  getUserOrders(page: number = 1): Observable<OrdersResponse> {
    const client: string[] = this.getClient();
    return this.http.get<OrdersResponse>(`${this.endPoint}/view?page=${page}`, {
      headers: {
        [client[0]]: client[1],
      },
    });
  }

  /**
   * Admin: View all orders
   * @param page number
   * @param limit number
   */
  adminViewAllOrders(page = 1, limit = 10): Observable<any> {
    return this.http.get(
      `${this.endPoint}/admin/orders?page=${page}&limit=${limit}`
    );
  }

  /**
   * Admin: Update an order (status/paymentStatus)
   * @param orderId string
   * @param updates object with fields to update {status: "shipped"}
   */
  adminUpdateOrder(orderId: string, updates: any): Observable<any> {
    return this.http.patch(
      `${this.endPoint}/admin/orders/${orderId}`,
      updates
    );
  }

  /**
   * Admin: Delete an order
   * @param orderId string
   */
  adminDeleteOrder(orderId: string): Observable<any> {
    return this.http.delete(
      `${this.endPoint}/admin/orders/${orderId}`
    );
  }
}


interface OrderItem {
  bookId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

 interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentLink: string | null;
  createdAt: string;
  updatedAt: string;
}

 interface OrdersResponse {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}
