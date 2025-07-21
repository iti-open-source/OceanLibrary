import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { registerationData } from "../types/registerationData";
import { registerationResponse } from "../types/registerationResponse";

@Injectable({
  providedIn: "root",
})
export class AuthApiService {
  private BASE_URL: string = "https://bookstore.adel.dev/server";
  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<{ status: string; data: string }> {
    return this.http.post<{ status: string; data: string }>(
      `${this.BASE_URL}/api/v1/users/login`,
      {
        email,
        password,
      }
    );
  }

  register(data: registerationData): Observable<registerationResponse> {
    return this.http.post<registerationResponse>(
      `${this.BASE_URL}/api/v1/users/register`,
      data
    );
  }

  forgotPassword(
    email: string
  ): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.BASE_URL}/api/v1/users/forgot-password`,
      { email }
    );
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<{ status: string; message: string }> {
    return this.http.patch<{ status: string; message: string }>(
      `${this.BASE_URL}/api/v1/users/reset-password/${token}`,
      { password, confirmPassword }
    );
  }
}
