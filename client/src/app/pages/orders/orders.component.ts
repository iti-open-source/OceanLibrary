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

  constructor(private ordersService: OrdersService) {}

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