import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private http: HttpClient) {}

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
   * Get All items in cart
   * @returns Observable
   */
  getCart(): Observable<any> {
    const clientHeader = this.isGuest()
      ? ["x-guest-id", "550e8400-e29b-41d4-a716-446655440000"]
      : [
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYzZmE1MzlhNGM4NGMwYjk1ZDdiYzAiLCJ1c2VyUm9sZSI6InVzZXIiLCJpYXQiOjE3NTE0MDgzMzksImV4cCI6MTc1MTQxMTkzOX0.VmuXLADNFpXoAGguCMyVdMMyTDUPV8NJz8WIXZJFdl8",
        ];
    return this.http
      .get("http://localhost:3000/api/v1/cart", {
        headers: {
          [clientHeader[0]]: clientHeader[1],
        },
      })
      .pipe(
        tap((data: any) => {
          this.cartCount = data.items?.length ?? 0;
        })
      );
  }
}
