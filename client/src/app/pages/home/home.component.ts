import { Component, OnInit } from "@angular/core";
import { BooksService } from "../../services/books.service";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-home",
  imports: [NgFor, NgIf, RouterModule, CommonModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  books: any[] = [];
  currentBook: any = null;
  recommendationBooks: any[] = [];
  trendingSeriesBooks: any[] = [];

  isLoading = false;
  errorMessage = "";

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;

    this.booksService.getAllBooks().subscribe({
      next: (data) => {
        let allBooks: any[] = [];

        if (Array.isArray(data)) {
          allBooks = data;
        } else if (data && data.data && Array.isArray(data.data.books)) {
          allBooks = data.data.books;
        } else {
          console.error("Unexpected API shape:", data);
          this.books = [];
          this.isLoading = false;
          return;
        }

        this.books = allBooks;
        this.currentBook = allBooks[0] || null;

        // Now BOTH sections have 3 books
        this.recommendationBooks = allBooks.slice(1, 6); // Books 1–3
        this.trendingSeriesBooks = allBooks.slice(5,10 ); // Books 4–6

        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error fetching books:", error);
        this.errorMessage = "Could not load books.";
        this.isLoading = false;
      },
    });
  }
}
