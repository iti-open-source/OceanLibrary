import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, Star, ShoppingCart, Heart } from "lucide-angular";
import { Book } from "../../types/book.interface";

@Component({
  selector: "app-browse-book-card",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./browse-book-card.component.html",
  styleUrl: "./browse-book-card.component.css",
})
export class BrowseBookCardComponent {
  @Input() book!: Book;
  @Output() addToCart = new EventEmitter<Book>();
  @Output() addToWishlist = new EventEmitter<Book>();
  @Output() viewDetails = new EventEmitter<Book>();

  readonly Star = Star;
  readonly ShoppingCart = ShoppingCart;
  readonly Heart = Heart;

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.book);
  }

  onAddToWishlist(event: Event) {
    event.stopPropagation();
    this.addToWishlist.emit(this.book);
  }

  onCardClick() {
    this.viewDetails.emit(this.book);
  }

  getStarArray(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Math.floor(rating));
  }

  capitalizeGenre(genre: string): string {
    return genre
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
