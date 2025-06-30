import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BooksService {
  private readonly API_URL = "http://localhost:3000/api/v1/books";

  constructor(private http: HttpClient) {}

  getAllBooks() {
    return this.http.get(this.API_URL);
  }
}
