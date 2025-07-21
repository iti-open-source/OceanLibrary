import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../types/user.interface";
import { AuthService } from "./auth.service";

export interface ProfileResponse {
  status: string;
  data: User;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private readonly API_URL = "https://bookstore.adel.dev/server/api/v1/users";

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Helper method to create authorization headers with JWT token
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get current user's profile
   */
  getCurrentUser(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.API_URL}/profile`, {
      headers: this.createAuthHeaders(),
    });
  }

  /**
   * Update current user's profile
   */
  updateProfile(data: UpdateProfileRequest): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.API_URL}/profile`, data, {
      headers: this.createAuthHeaders(),
    });
  }

  /**
   * Change user's password
   */
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(
      `${this.API_URL}/change-password`,
      data,
      {
        headers: this.createAuthHeaders(),
      }
    );
  }
}
