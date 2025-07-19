import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { GetAuthorsOptions } from "../types/authorOptions";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthorsService {
  private readonly API_URL = "http://localhost:3000/api/v1/authors";

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

  /**
   * Create a new author with optional photo upload
   * @param formData - FormData containing author data and optional photo
   * @returns Observable with the created author
   */
  createAuthor(formData: FormData): Observable<any> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();
      return this.http.post(`${this.API_URL}`, formData, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Get all authors with optional filtering, pagination, and sorting
   * @param options - Query options for filtering and pagination
   * @returns Observable with authors list and pagination info
   */
  getAllAuthors(options: GetAuthorsOptions = {}): Observable<any> {
    const params: { [key: string]: string } = {};

    // Add pagination parameters
    if (options.page) params["page"] = options.page.toString();
    if (options.limit) params["limit"] = options.limit.toString();

    // Add search/filter parameters
    if (options.name) params["name"] = options.name;
    if (options.nationality) params["nationality"] = options.nationality;
    if (options.genres && options.genres.length > 0) {
      params["genres"] = options.genres.join(",");
    }
    if (options.match) params["match"] = options.match;
    if (options.sortBy) params["sortBy"] = options.sortBy;
    if (options.sortOrder) params["sortOrder"] = options.sortOrder;
    if (options.fields && options.fields.length > 0) {
      params["fields"] = options.fields.join(",");
    }

    // Build query string
    const queryString =
      Object.keys(params).length > 0
        ? "?" +
          Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join("&")
        : "";

    return this.http.get(`${this.API_URL}${queryString}`);
  }

  /**
   * Get a specific author by ID
   * @param id - The author's ID
   * @returns Observable with the author data
   */
  getAuthorById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  /**
   * Update an existing author by ID with optional photo upload
   * @param id - The author's ID
   * @param formData - FormData containing updated author data and optional photo
   * @returns Observable with the updated author
   */
  updateAuthorById(id: string, formData: FormData): Observable<any> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();
      return this.http.patch(`${this.API_URL}/${id}`, formData, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Delete an author by ID
   * @param id - The author's ID
   * @returns Observable with the deletion result
   */
  deleteAuthorById(id: string): Observable<any> {
    try {
      this.checkAdminAuthorization();
      const headers = this.createAuthHeaders();
      return this.http.delete(`${this.API_URL}/${id}`, { headers });
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Get autocomplete suggestions for author search
   * @param searchTerm - The search term to get suggestions for
   * @returns Observable with limited author results for suggestions
   */
  getSearchSuggestions(searchTerm: string): Observable<any> {
    const params = {
      name: searchTerm,
      limit: "6", // Reduce for better performance
      fields: "name,nationality",
    };

    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.append(key, value);
    });

    return this.http.get(`${this.API_URL}?${urlParams.toString()}`);
  }
}
