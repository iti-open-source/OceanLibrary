import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-cart",
  imports: [CommonModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent implements OnInit {
  cartItems: item[] = [];
  loading!: boolean;

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cart.getCart().subscribe({
      next: (data: any) => {
        this.cartItems = data.userCart.items;
        this.loading = false;
      },
      error: (error) => {
        console.log(error.error.message);
        this.loading = false;
      },
    });
  }

  /**
   * Change quantity of an item in cart
   * @param bookId - the id of the book we want to edit
   * @param newQuantity - the new quantity to add to cart
   */
  updateCart(bookId: string, newQuantity: number) {
    this.loading = true;
    this.cart.updateCart(bookId, newQuantity).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loadCart();
      },
      error: (error) => {
        console.log(error.error.message);
        this.loading = false;
      },
    });
  }

  /**
   * Delete an item in the cart
   * @param bookId - the id of the book we want to remove
   */
  deleteItem(bookId: string) {
    this.loading = true;
    this.cart.deleteItem(bookId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loadCart();
      },
      error: (error) => {
        console.log(error.error.message);
        this.loading = false;
      },
    });
  }
}

interface item {
  bookId: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  subtotal: number;
}
