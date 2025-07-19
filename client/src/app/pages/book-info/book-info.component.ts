import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookHeroComponent } from "../../components/book-hero/book-hero.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";
import { BooksService } from "../../services/books.service";
import { BookDataService } from "../../services/book-data.service";
import { Book } from "../../types/book.interface";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-book-info",
  imports: [BookHeroComponent, RouterModule, LucideAngularModule, CommonModule],
  templateUrl: "./book-info.component.html",
  styleUrl: "./book-info.component.css",
})
export class BookInfoComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  bookId: string = "";
  loading: boolean = true;
  error: string = "";
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private booksService: BooksService,
    private bookDataService: BookDataService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        this.bookId = params.get("bookID") || "";

        if (this.bookId) {
          this.fetchBook();
        } else {
          this.error = "No book ID provided";
          this.loading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchBook(): void {
    this.loading = true;
    this.booksService.getBookById(this.bookId).subscribe({
      next: (response) => {
        if (response.status === "Success" && response.data?.book) {
          this.book = response.data.book;
          this.bookDataService.setCurrentBook(this.book);
        } else {
          this.error = "Book not found";
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error fetching book:", error);
        this.error = "Failed to load book details";
        this.loading = false;
      },
    });
  }
}
