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

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cart.getCart().subscribe({
      next: (data: any) => {
        this.cartItems = data.userCart.items;
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  updateCart(bookId: string, newQuantity: number) {
    this.cart.updateCart(bookId, newQuantity).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loadCart();
      },
      error: (error) => {
        console.log(error.error.message);
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
