import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { OrdersService } from "../../services/orders.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-cart",
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, FormsModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent implements OnInit {
  cartItems: item[] = [];
  cartQuantity: number = 0;
  totalAmount: number = 0;
  loading!: boolean;
  errorMessage: string = "";
  selectedPaymentMethod: string = 'cash'; 

  constructor(private cart: CartService, private order: OrdersService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cart.getCart().subscribe({
      next: (data: any) => {
        this.totalAmount = data.userCart.total;
        this.cartItems = data.userCart.items;
        this.cartQuantity = this.cart.cartCount;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          "We're having trouble reaching the server. Please check your internet connection and try again shortly.";
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
        this.loadCart();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          "We're having trouble reaching the server. Please check your internet connection and try again shortly.";
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
        this.loadCart();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          "We're having trouble reaching the server. Please check your internet connection and try again shortly.";
        this.loading = false;
      },
    });
  }

  placeOrder(method: string) {
    this.loading = true;
    this.order.placeOrder(method).subscribe({
      next: (data: any) => {
        alert(data.message);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          "We're having trouble reaching the server. Please check your internet connection and try again shortly.";
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
