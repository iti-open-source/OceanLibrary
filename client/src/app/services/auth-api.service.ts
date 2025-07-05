import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { registerationData } from "../types/registerationData";
import { registerationResponse } from "../types/registerationResponse";

@Injectable({
  providedIn: "root",
})
export class AuthApiService {
  private BASE_URL: string = "http://localhost:3000";
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
}
