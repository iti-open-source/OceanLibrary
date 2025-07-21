import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatbotService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private getClient(): string[] {
    const JWT_Token = this.auth.isLoggedIn() ? this.auth.getToken() : null;
    const clientHeader: string[] = ["Authorization", `Bearer ${JWT_Token}`];
    return clientHeader;
  }

  getAIResponse(message: string): Observable<any> {
    const client: string[] = this.getClient();
    return this.http.post(
      `http://104.244.74.223:3000/api/v1/chat`,
      { message },
      {
        headers: {
          [client[0]]: client[1],
        },
      }
    );
  }
}
