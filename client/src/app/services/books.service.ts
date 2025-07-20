import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { GetBooksOptions } from "../types/bookOptions";
import { AuthService } from "./auth.service";
@Injectable({
  providedIn: "root",
})
export class BooksService {
  private readonly API_URL = "http://localhost:3000/api/v1/books";

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
   * Helper method to create authorization headers with JWT token
   * @returns HttpHeaders with Authorization header
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createBook(formData: FormData): Observable<any> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();
      return this.http.post(`${this.API_URL}`, formData, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getAllBooks(options: GetBooksOptions = {}): Observable<any> {
    const {
      page,
      limit,
      search,
      title,
      author,
      priceMin,
      priceMax,
      inStockOnly,
      genres,
      match,
      sortBy,
      fields,
    } = options;

    const params: { [key: string]: string } = {};

    if (page !== undefined) params["page"] = page.toString();
    if (limit !== undefined) params["limit"] = limit.toString();
    if (search) params["search"] = search;
    if (title) params["title"] = title;
    if (author) params["author"] = author;
    if (priceMin !== undefined) params["priceMin"] = priceMin.toString();
    if (priceMax !== undefined) params["priceMax"] = priceMax.toString();
    if (inStockOnly !== undefined)
      params["inStockOnly"] = inStockOnly.toString();
    if (genres) params["genres"] = genres.join(",");
    if (match) params["match"] = match;
    if (sortBy) params["sortBy"] = sortBy;
    if (fields) params["fields"] = fields.join(",");

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

  updateBookById(id: string, formData: FormData): Observable<any> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();
      return this.http.patch(`${this.API_URL}/${id}`, formData, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  deleteBookById(id: string): Observable<any> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();
      return this.http.delete(`${this.API_URL}/${id}`, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Get autocomplete suggestions for search
   * @param searchTerm - The search term to get suggestions for
   * @returns Observable with limited book results for suggestions
   */
  getSearchSuggestions(searchTerm: string): Observable<any> {
    const params = {
      search: searchTerm,
      limit: "6", // Reduce for better performance
      fields: "title,authorName,image",
    };

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.append(key, value);
    });

    return this.http.get(`${this.API_URL}?${urlParams.toString()}`);
  }
}
