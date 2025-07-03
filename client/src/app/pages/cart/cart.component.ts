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
  cartItems: [] = [];

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.cart.getCart().subscribe({
      next: (data) => {
        this.cartItems = data.userCart.items;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
