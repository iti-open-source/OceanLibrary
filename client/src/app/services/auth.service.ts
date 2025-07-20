import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/decodedToken";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly tokenKey = "auth_token";
  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authState$: Observable<boolean> = this.authStateSubject.asObservable();

  constructor() {
    // Listen for localStorage changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.tokenKey) {
        this.authStateSubject.next(this.isLoggedIn());
      }
    });
  }

  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.authStateSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authStateSubject.next(false);
  }

  logoutAndRedirect(): void {
    this.logout();
    // Use window.location to force a complete page reload and redirect
    window.location.href = "/";
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.decodeToken();
    if (!decodedToken) return false;

    const { exp } = decodedToken;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    // JWT should have exactly 3 parts separated by dots
    if (token.split(".").length !== 3) {
      console.error(
        "Invalid JWT format: token should have 3 parts separated by dots"
      );
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  }

  getUserId(): string | null {
    return this.decodeToken()?.userId || null;
  }

  getUserRole(): string | null {
    return this.decodeToken()?.userRole || null;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === "admin" || role === "super-admin";
  }

  isSuperAdmin(): boolean {
    const role = this.getUserRole();
    return role === "super-admin";
  }
}
