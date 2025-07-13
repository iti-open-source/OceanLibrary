import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  //API
  private endPoint: string = "http://localhost:3000/api/v1/cart";

  // Can be used in (navbar) to display number of items in cart
  cartCount: number = 0;


  private getGuestToken() {
    let uuid = localStorage.getItem("guestId");
    if (!uuid || !(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(uuid)) {
      uuid = uuidv4();
      localStorage.setItem("guestId", uuid);
    }
    return uuid;
  }

  /**
   * Set client header
   * @returns either JWT token or guest ID
   */
  private getClient(): string[] {
    const JWT_Token = this.auth.isLoggedIn() ? this.auth.getToken() : null;
    const guestToken = this.getGuestToken();
    const clientHeader: string[] = JWT_Token 
      ? [
          "Authorization",
          `Bearer ${JWT_Token}`,
        ]: ["x-guest-id", guestToken];
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
   * Delete an item from the cart
   * @param bookId - the id of the book we want to remove
   * @returns observable with data
   */
  deleteItem(bookId: string): Observable<any> {
    const client: string[] = this.getClient();
    return this.http.delete(`${this.endPoint}/item`, {
      body: {
        bookId,
      },
      headers: {
        [client[0]]: client[1],
      },
    });
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
          this.cartCount =
            data.userCart.items?.reduce(
              (total: any, item: any) => total + item.quantity,
              0
            ) ?? 0;
        })
      );
  }

  syncCart(): void{
    const clientJWT = this.auth.isLoggedIn() ? this.auth.getToken() : null;
    const guestToken = this.getGuestToken();
    if (clientJWT && guestToken) {
      alert(1); 
      this.http.post(
        `${this.endPoint}/merge`,
        {
          "guestId": guestToken,
        },
        {
          headers: {
            "Authorization": `Bearer ${clientJWT}`
          },
        }
      ).subscribe({
        next: (res) => { 
          // cart synced
          //console.log(res);
        },
        error: (err) => {
          // cart sync failed
          //console.log(err);
      }});
    }
  }
}
