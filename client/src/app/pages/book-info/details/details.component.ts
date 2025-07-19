import { NgClass, NgFor, NgIf, CommonModule } from "@angular/common";
import { Component, OnInit, OnChanges, OnDestroy } from "@angular/core";
import { Book } from "../../../types/book.interface";
import { BooksService } from "../../../services/books.service";
import { BookDataService } from "../../../services/book-data.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-details",
  imports: [NgClass, NgFor, NgIf, CommonModule],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.css",
})
export class DetailsComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  private subscription: Subscription = new Subscription();
  similarBooks: Book[] = [];

  constructor(
    private booksService: BooksService,
    private bookDataService: BookDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.bookDataService.currentBook$.subscribe((book) => {
        this.book = book;
        if (this.book) {
          this.fetchSimilarBooks();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToSimilarBook(book: Book): void {
    this.bookDataService.setCurrentBook(book);
    this.router.navigateByUrl(`book-info/${book._id}`);
  }

  private fetchSimilarBooks(): void {
    if (!this.book || !this.book.genres.length) return;

    // Fetch books with similar genres
    this.booksService
      .getAllBooks({
        genres: this.book.genres.slice(0, 2), // Use first 2 genres
        limit: 5,
      })
      .subscribe({
        next: (response) => {
          if (response.status === "Success" && response.data?.books) {
            // Filter out the current book
            this.similarBooks = response.data.books
              .filter((book: Book) => book._id !== this.book?._id)
              .slice(0, 5);
          }
        },
        error: (error) => {
          console.error("Error fetching similar books:", error);
          // Keep the default empty array
        },
      });
  }
}
