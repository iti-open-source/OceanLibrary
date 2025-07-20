import { Component, Input } from "@angular/core";
import { Book } from "../../types/book.interface";
import { CommonModule } from "@angular/common";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-book-hero",
  imports: [CommonModule],
  templateUrl: "./book-hero.component.html",
  styleUrl: "./book-hero.component.css",
})
export class BookHeroComponent {
  @Input() book: Book | null = null;
  isAddingToCart: boolean = false;
  addToCartSuccess: boolean = false;

  constructor(private cartService: CartService) {}

  onAddToCart() {
    if (!this.book || this.isAddingToCart) return;

    this.isAddingToCart = true;

    this.cartService.addToCart(this.book._id, 1).subscribe({
      next: (response) => {
        this.isAddingToCart = false;
        this.addToCartSuccess = true;

        // Reset success state after animation - longer duration for better UX
        setTimeout(() => {
          this.addToCartSuccess = false;
        }, 3000);

        console.log("Added to cart:", this.book?.title);
      },
      error: (error) => {
        this.isAddingToCart = false;
        console.error("Error adding to cart:", error);

        // You could add error handling here, such as showing an error message
        // For now, we'll just log the error
      },
    });
  }
}
