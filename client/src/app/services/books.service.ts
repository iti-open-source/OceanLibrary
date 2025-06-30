import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  CreateBookOptions,
  GetBooksOptions,
  UpdateBookOptions,
} from "../types/bookOptions";
@Injectable({
  providedIn: "root",
})
export class BooksService {
  private readonly API_URL = "http://localhost:3000/api/v1/books";

  constructor(private http: HttpClient) {}

  createBook(bookData: CreateBookOptions): Observable<any> {
    // TODO: Check for the user role before making the request, only admins allowed
    return this.http.post(`${this.API_URL}`, bookData);
  }

  getAllBooks(options: GetBooksOptions = {}): Observable<any> {
    const {
      page,
      limit,
      title,
      author,
      priceMin,
      priceMax,
      genres,
      match,
      order,
      sortBy,
    } = options;

    const params: { [key: string]: string } = {};

    if (page !== undefined) params["page"] = page.toString();
    if (limit !== undefined) params["limit"] = limit.toString();
    if (title) params["title"] = title;
    if (author) params["author"] = author;
    if (priceMin !== undefined) params["priceMin"] = priceMin.toString();
    if (priceMax !== undefined) params["priceMax"] = priceMax.toString();
    if (genres) params["genres"] = genres.join(",");
    if (match) params["match"] = match;
    if (order) params["order"] = order;
    if (sortBy) params["sortBy"] = sortBy;

    const queryString =
      Object.keys(params).length > 0
        ? "?" +
          Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join("&")
        : "";

    return this.http.get(`${this.API_URL}${queryString}`);
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  updateBookById(
    id: string,
    updateOptions: UpdateBookOptions
  ): Observable<any> {
    // TODO: Check for the user role before making the request, only admins allowed
    return this.http.patch(`${this.API_URL}/${id}`, updateOptions);
  }

  deleteBookById(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
