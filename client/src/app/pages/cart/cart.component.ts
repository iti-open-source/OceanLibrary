import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { CommonModule } from "@angular/common";
import { Route, Router, RouterLink } from "@angular/router";
import { OrdersService } from "../../services/orders.service";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

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

  constructor(private cart: CartService, private order: OrdersService, public auth: AuthService, public router: Router) {}

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
        if (data.paymentLink) {
          //window.location.href = data.paymentLink;
          this.showPaymentModal(data.paymentLink);
        } else {
          this.router.navigate(["/orders"]);
        }
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

  showPaymentModal(paymentLink: string) {
    // Create modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'relative';
    iframeContainer.style.width = '80%';
    iframeContainer.style.maxWidth = '600px';
    iframeContainer.style.height = '70%';
    iframeContainer.style.backgroundColor = 'white';
    iframeContainer.style.borderRadius = '8px';
    iframeContainer.style.padding = '20px';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = paymentLink;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 30px)';
    iframe.style.border = 'none';
    iframe.style.marginTop = '30px';
    
    // Append elements
    iframeContainer.appendChild(iframe);
    modal.appendChild(iframeContainer);
    document.body.appendChild(modal);
    
    // Close modal handler
    const closeModal = () => {
      document.body.removeChild(modal);
      // Check payment status after iframe closes
      // this.checkPaymentStatus();
    };
    
    closeButton.addEventListener('click', closeModal);
    
    // Listen for messages from the iframe (if Paymob supports postMessage)
    window.addEventListener('message', (event) => {
      // Verify the origin is from Paymob's domain for security
      if (event.origin === 'https://accept.paymob.com') {
        if (event.data.paymentStatus === 'success') {
          closeModal();
          this.router.navigate(['/orders']);
        } else if (event.data.paymentStatus === 'failed') {
          closeModal();
          this.errorMessage = 'Payment failed. Please try again.';
        }
      }
    });
    
    // Alternatively, poll for payment status if postMessage isn't available
    // this.paymentStatusInterval = setInterval(() => {
    //   this.checkPaymentStatus();
    // }, 5000);
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
