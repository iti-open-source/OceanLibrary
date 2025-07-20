import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import {
  LucideAngularModule,
  ShoppingCart,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  CreditCard,
  Banknote,
} from "lucide-angular";

import { OrdersService } from "../../../../services/orders.service";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { OrderRowComponent } from "../order-row/order-row.component";

interface OrderItem {
  bookId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId:
    | {
        _id: string;
        username: string;
        email: string;
      }
    | string; // Can be populated object or just the ID
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentLink: string | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: "app-orders-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ErrorModalComponent,
    OrderRowComponent,
  ],
  templateUrl: "./orders-list.component.html",
  styleUrl: "./orders-list.component.css",
})
export class OrdersListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  totalOrders = 0;

  // Filtering
  statusFilter = "all"; // 'all', 'pending', 'shipped', 'delivered', 'canceled', 'on-the-way'
  paymentStatusFilter = "all"; // 'all', 'pending', 'paid'
  paymentMethodFilter = "all"; // 'all', 'cash', 'paymob'

  // Current filters for API
  private currentFilters: any = {};

  // Actions
  actionLoading: { [orderId: string]: boolean } = {};
  selectedOrderId: string | null = null;

  // Error modal
  showErrorModal = false;
  errorModalTitle = "Error";
  errorModalMessage = "";
  errorModalShowAction = false;
  errorModalActionText = "Try Again";

  // Utility
  Math = Math;

  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly ShoppingCart = ShoppingCart;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Package = Package;
  readonly Truck = Truck;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly MoreVertical = MoreVertical;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly DollarSign = DollarSign;
  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;

    // Build filters object
    const filters: any = {};
    if (this.statusFilter !== "all") {
      filters.status = this.statusFilter;
    }
    if (this.paymentStatusFilter !== "all") {
      filters.paymentStatus = this.paymentStatusFilter;
    }
    if (this.paymentMethodFilter !== "all") {
      filters.paymentMethod = this.paymentMethodFilter;
    }

    this.ordersService
      .adminViewAllOrders(this.currentPage, this.itemsPerPage, filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders = response.orders || [];
          this.currentPage = response.currentPage || 1;
          this.totalPages = response.totalPages || 1;
          this.totalOrders = response.totalOrders || 0;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading orders:", error);
          const errorMessage = error.error?.message || "Failed to load orders";
          this.error = errorMessage;
          this.showError("Loading Error", errorMessage);
          this.loading = false;
        },
      });
  }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  // Smart pagination helper - shows a limited number of page buttons
  getVisiblePageNumbers(): (number | "ellipsis")[] {
    const maxVisible = 5;
    const pages: (number | "ellipsis")[] = [];

    if (this.totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate the range around current page
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      // Add ellipsis before if needed
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis after if needed
      if (end < this.totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page (if not already included)
      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  // Status update methods
  updateOrderStatus(orderId: string, newStatus: string) {
    this.actionLoading[orderId] = true;

    this.ordersService
      .adminUpdateOrder(orderId, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadOrders(); // Reload to get updated data
          this.actionLoading[orderId] = false;
        },
        error: (error) => {
          console.error("Error updating order status:", error);
          this.showError(
            "Update Error",
            error.error?.message || "Failed to update order status"
          );
          this.actionLoading[orderId] = false;
        },
      });
  }

  updatePaymentStatus(orderId: string, newPaymentStatus: string) {
    this.actionLoading[orderId] = true;

    this.ordersService
      .adminUpdateOrder(orderId, { paymentStatus: newPaymentStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadOrders(); // Reload to get updated data
          this.actionLoading[orderId] = false;
        },
        error: (error) => {
          console.error("Error updating payment status:", error);
          this.showError(
            "Update Error",
            error.error?.message || "Failed to update payment status"
          );
          this.actionLoading[orderId] = false;
        },
      });
  }

  onStatusChange(orderId: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updateOrderStatus(orderId, target.value);
    }
  }

  onPaymentStatusChange(orderId: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updatePaymentStatus(orderId, target.value);
    }
  }

  trackByOrderId(index: number, order: Order): string {
    return order._id;
  }

  deleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }

    this.actionLoading[orderId] = true;

    this.ordersService
      .adminDeleteOrder(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadOrders(); // Reload to get updated data
          this.actionLoading[orderId] = false;
        },
        error: (error) => {
          console.error("Error deleting order:", error);
          this.showError(
            "Delete Error",
            error.error?.message || "Failed to delete order"
          );
          this.actionLoading[orderId] = false;
        },
      });
  }

  // Error modal methods
  showError(title: string, message: string, showAction = false) {
    this.errorModalTitle = title;
    this.errorModalMessage = message;
    this.errorModalShowAction = showAction;
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  onErrorModalAction() {
    this.loadOrders();
    this.closeErrorModal();
  }

  // Filter methods (for future enhancement)
  onStatusFilterChange() {
    // TODO: Implement filtering by status
    this.currentPage = 1;
    this.loadOrders();
  }

  onPaymentStatusFilterChange() {
    // TODO: Implement filtering by payment status
    this.currentPage = 1;
    this.loadOrders();
  }

  onPaymentMethodFilterChange() {
    // TODO: Implement filtering by payment method
    this.currentPage = 1;
    this.loadOrders();
  }
}
