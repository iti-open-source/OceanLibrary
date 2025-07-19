import { NgClass, NgFor, NgIf, CommonModule } from "@angular/common";
import { Component, OnInit, OnChanges, OnDestroy } from "@angular/core";
import { Book } from "../../../types/book.interface";
import { Author } from "../../../types/author.interface";
import { BooksService } from "../../../services/books.service";
import { AuthorsService } from "../../../services/authors.service";
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
  author: Author | null = null;
  private subscription: Subscription = new Subscription();
  similarBooks: Book[] = [];
  loadingSimilarBooks = false;

  constructor(
    private booksService: BooksService,
    private authorsService: AuthorsService,
    private bookDataService: BookDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.bookDataService.currentBook$.subscribe((book) => {
        this.book = book;
        if (this.book) {
          this.fetchAuthorInfo();
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

  handleAuthorImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src =
        "https://images.assetsdelivery.com/compings_v2/apoev/apoev1811/apoev181100196.jpg";
    }
  }

  private fetchAuthorInfo(): void {
    console.log("fetchAuthorInfo called, book:", this.book);
    if (!this.book || !this.book.authorID) {
      console.log("No book or authorID:", {
        book: this.book,
        authorID: this.book?.authorID,
      });
      this.author = null;
      return;
    }

    console.log("Fetching author with ID:", this.book.authorID);
    this.authorsService.getAuthorById(this.book.authorID).subscribe({
      next: (response) => {
        console.log("Author API response:", response);
        if (response.status === "Success" && response.data?.author) {
          this.author = response.data.author;
          console.log("Author set to:", this.author);
        } else {
          this.author = null;
          console.log("Author response failed or no data");
        }
      },
      error: (error) => {
        console.error("Error fetching author info:", error);
        this.author = null;
      },
    });
  }

  private fetchSimilarBooks(): void {
    if (!this.book || !this.book.genres.length) {
      this.similarBooks = [];
      return;
    }

    this.loadingSimilarBooks = true;
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
          } else {
            this.similarBooks = [];
          }
          this.loadingSimilarBooks = false;
        },
        error: (error) => {
          console.error("Error fetching similar books:", error);
          this.similarBooks = [];
          this.loadingSimilarBooks = false;
        },
      });
  }
}
