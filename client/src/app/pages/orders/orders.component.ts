import { Component } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-orders',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: Order[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalOrders: number = 0;
  isLoading: boolean = true;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private ordersService: OrdersService) {
    this.ordersService.adminViewAllOrders().subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
      }
    });
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading = true;
    this.ordersService.getUserOrders(this.currentPage).subscribe({
      next: (response:any) => {
        this.orders = response.orders;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalOrders = response.totalOrders;
        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchOrders();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchOrders();
    }
  }

    showPaymentModal(paymentLink: string) {
      // Create modal container
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(var(--color-brand-primary-rgb), 0.2)';
      modal.style.backdropFilter = 'blur(5px)';
      modal.style.display = 'flex';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';
      
      // Create iframe container
      const iframeContainer = document.createElement('div');
      iframeContainer.style.position = 'relative';
      iframeContainer.style.width = '90%';
      iframeContainer.style.maxWidth = '800px';
      iframeContainer.style.height = '80%';
      iframeContainer.style.backgroundColor = 'var(--color-background-light)';
      iframeContainer.style.borderRadius = '12px';
      iframeContainer.style.padding = '20px';
      iframeContainer.style.boxShadow = '0 10px 25px rgba(var(--color-brand-primary-rgb), 0.2)';
      iframeContainer.style.border = '1px solid var(--color-border)';
      
      // Create close button with your theme styling
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.style.width = '32px';
      closeButton.style.height = '32px';
      closeButton.style.borderRadius = '50%';
      closeButton.style.backgroundColor = 'var(--color-brand-primary)';
      closeButton.style.color = 'var(--color-on-dark)';
      closeButton.style.border = 'none';
      closeButton.style.fontSize = '20px';
      closeButton.style.fontWeight = 'bold';
      closeButton.style.cursor = 'pointer';
      closeButton.style.display = 'flex';
      closeButton.style.justifyContent = 'center';
      closeButton.style.alignItems = 'center';
      closeButton.style.transition = 'all 0.2s ease';
      
      // Hover effect
      closeButton.onmouseenter = () => {
        closeButton.style.backgroundColor = 'color-mix(in srgb, var(--color-brand-primary) 80%, black)';
        closeButton.style.transform = 'scale(1.1)';
      };
      closeButton.onmouseleave = () => {
        closeButton.style.backgroundColor = 'var(--color-brand-primary)';
        closeButton.style.transform = 'scale(1)';
      };
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = "data:text/html;charset=utf-8,Loading..."
      iframe.src = paymentLink;
      iframe.style.width = '100%';
      iframe.style.height = 'calc(100% - 30px)';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.marginTop = '30px';
      
      // Append elements
      iframeContainer.appendChild(closeButton);
      iframeContainer.appendChild(iframe);
      modal.appendChild(iframeContainer);
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
      
      // Close modal handler
      const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = ''; // Restore scrolling
        this.fetchOrders(); // Refresh orders after modal closes
      };
      
      closeButton.addEventListener('click', closeModal);
      
      // Also close when clicking outside content
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
      
      // Listen for messages from the iframe
      window.addEventListener('message', (event) => {
        // Verify the origin is from Paymob's domain
        if (event.origin === 'https://accept.paymob.com') {
          if (event.data.paymentStatus === 'success') {
            closeModal();
            this.showPaymentSuccess(); // Optional: Show success message
          } else if (event.data.paymentStatus === 'failed') {
            closeModal();
            this.errorMessage = 'Payment failed. Please try again.';
          }
        }
      });
      
      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      });
  }

  // Optional success message
  showPaymentSuccess() {
      this.errorMessage = 'Payment successful! Your order is being processed.';
      setTimeout(() => this.errorMessage = '', 5000);
  }
}

interface OrderItem {
  bookId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

 interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentLink: string | null;
  createdAt: string;
  updatedAt: string;
}

 interface OrdersResponse {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}