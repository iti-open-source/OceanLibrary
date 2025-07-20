import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  User,
  GetUsersResponse,
  UserActionResponse,
} from "../types/user.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private readonly API_URL = "http://localhost:3000/api/v1/users";

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Helper method to check if user has admin privileges
   * @returns void - throws error if not authorized
   * @throws Error if user is not logged in or not an admin
   */
  private checkAdminAuthorization(): void {
    if (!this.authService.isLoggedIn()) {
      throw new Error("Authentication required. Please log in.");
    }

    if (!this.authService.isAdmin()) {
      throw new Error(
        "Admin access required. Only administrators can perform this action."
      );
    }
  }

  /**
   * Helper method to check if user has super admin privileges
   * @returns void - throws error if not authorized
   * @throws Error if user is not logged in or not a super admin
   */
  private checkSuperAdminAuthorization(): void {
    if (!this.authService.isLoggedIn()) {
      throw new Error("Authentication required. Please log in.");
    }

    if (!this.authService.isSuperAdmin()) {
      throw new Error(
        "Super admin access required. Only super administrators can perform this action."
      );
    }
  }

  /**
   * Helper method to create authorization headers with JWT token
   * @returns HttpHeaders with Authorization header
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Helper method to handle HTTP errors and redirect on authorization failures
   * @param error - The HTTP error
   * @returns Observable that throws the error or handles redirect
   */
  private handleError(error: any): Observable<never> {
    // Check for authorization errors (401 Unauthorized, 403 Forbidden)
    if (error.status === 401 || error.status === 403) {
      console.warn(
        "Authorization error detected, redirecting to homepage:",
        error
      );
      // Redirect user to homepage after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
    return throwError(() => error);
  }

  /**
   * Get all users with pagination and filtering
   * @param page - Page number (default: 1)
   * @param limit - Number of users per page (default: 10)
   * @param search - Search term for username, email, or phone
   * @param role - Role filter ('all', 'user', 'admin', 'super-admin')
   * @param status - Status filter ('all', 'active', 'banned')
   * @returns Observable<GetUsersResponse>
   */
  getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
    status?: string
  ): Observable<GetUsersResponse> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();

      let params = new HttpParams();
      params = params.set("page", page.toString());
      params = params.set("limit", limit.toString());

      if (search) {
        params = params.set("search", search);
      }

      if (role && role !== "all") {
        params = params.set("role", role);
      }

      if (status && status !== "all") {
        params = params.set("status", status);
      }

      return this.http
        .get<GetUsersResponse>(`${this.API_URL}`, {
          headers,
          params,
        })
        .pipe(catchError((error) => this.handleError(error)));
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Ban a user (admin or super admin)
   * @param userId - ID of the user to ban
   * @returns Observable<UserActionResponse>
   */
  banUser(userId: string): Observable<UserActionResponse> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();

      // Use super-admin endpoint if user is super-admin, otherwise use admin endpoint
      const isSuperAdmin = this.authService.isSuperAdmin();
      const endpoint = isSuperAdmin
        ? `${this.API_URL}/super-admin/ban/${userId}`
        : `${this.API_URL}/admin/ban/${userId}`;

      return this.http
        .patch<UserActionResponse>(endpoint, {}, { headers })
        .pipe(catchError((error) => this.handleError(error)));
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Unban a user (admin or super admin)
   * @param userId - ID of the user to unban
   * @returns Observable<UserActionResponse>
   */
  unbanUser(userId: string): Observable<UserActionResponse> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();

      // Use super-admin endpoint if user is super-admin, otherwise use admin endpoint
      const isSuperAdmin = this.authService.isSuperAdmin();
      const endpoint = isSuperAdmin
        ? `${this.API_URL}/super-admin/unban/${userId}`
        : `${this.API_URL}/admin/unban/${userId}`;

      return this.http
        .patch<UserActionResponse>(endpoint, {}, { headers })
        .pipe(catchError((error) => this.handleError(error)));
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Promote a user to admin (super admin only)
   * @param userId - ID of the user to promote
   * @returns Observable<UserActionResponse>
   */
  promoteUser(userId: string): Observable<UserActionResponse> {
    try {
      this.checkSuperAdminAuthorization();
      const headers = this.createAuthHeaders();

      return this.http
        .patch<UserActionResponse>(
          `${this.API_URL}/promote/${userId}`,
          {},
          { headers }
        )
        .pipe(catchError((error) => this.handleError(error)));
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Demote an admin to user (super admin only)
   * @param userId - ID of the user to demote
   * @returns Observable<UserActionResponse>
   */
  demoteUser(userId: string): Observable<UserActionResponse> {
    try {
      this.checkSuperAdminAuthorization();
      const headers = this.createAuthHeaders();

      return this.http
        .patch<UserActionResponse>(
          `${this.API_URL}/demote/${userId}`,
          {},
          { headers }
        )
        .pipe(catchError((error) => this.handleError(error)));
    } catch (error) {
      return this.handleError(error);
    }
  }
}
