import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private http: HttpClient) {}

  //API
  private endPoint: string = "http://localhost:3000/api/v1/cart";

  // Can be used in (navbar) to display number of items in cart
  cartCount: number = 0;

  /**
   * Checks if client is a guest or loggedin
   * @returns boolen
   */
  private isGuest() {
    return true;
  }

  /**
   * Set client header
   * @returns either JWT token or guest ID
   */
  private getClient(): string[] {
    const clientHeader: string[] = this.isGuest()
      ? ["x-guest-id", "550e8400-e29b-41d4-a716-446655440000"]
      : [
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYzZmE1MzlhNGM4NGMwYjk1ZDdiYzAiLCJ1c2VyUm9sZSI6InVzZXIiLCJpYXQiOjE3NTE0MDgzMzksImV4cCI6MTc1MTQxMTkzOX0.VmuXLADNFpXoAGguCMyVdMMyTDUPV8NJz8WIXZJFdl8",
        ];
    return clientHeader;
  }

  /**
   *
   * @param bookId - The id of the book you want to add into cart
   * @param quantity - The quantity of that book
   * @returns Observable contains the response
   */
  addToCart(bookId: string, quantity: number): Observable<any> {
    const client: string[] = this.getClient();
    return this.http.post(
      this.endPoint,
      {
        bookId,
        quantity,
      },
      {
        headers: {
          [client[0]]: client[1],
        },
      }
    );
  }

  /**
   *
   * @param bookId Takes
   * @param newQuantity
   */
  updateCart(bookId: string, newQuantity: number): Observable<any> {
    const client: string[] = this.getClient();
    return this.http.patch(
      this.endPoint,
      {
        bookId,
        quantity: newQuantity,
      },
      {
        headers: {
          [client[0]]: client[1],
        },
      }
    );
  }

  /**
   * Get All items in cart
   * @returns Observable
   */
  getCart(): Observable<any> {
    const client: string[] = this.getClient();
    return this.http
      .get(this.endPoint, {
        headers: {
          [client[0]]: client[1],
        },
      })
      .pipe(
        tap((data: any) => {
          this.cartCount = data.items?.length ?? 0;
        })
      );
  }
}
