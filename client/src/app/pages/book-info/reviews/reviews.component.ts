import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookDataService } from "../../../services/book-data.service";
import { Book } from "../../../types/book.interface";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-reviews",
  imports: [CommonModule],
  templateUrl: "./reviews.component.html",
  styleUrl: "./reviews.component.css",
})
export class ReviewsComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private bookDataService: BookDataService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.bookDataService.currentBook$.subscribe((book) => {
        this.book = book;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
