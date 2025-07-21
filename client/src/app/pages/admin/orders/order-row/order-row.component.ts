import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  Clock,
  Trash2,
  CreditCard,
  Banknote,
  Eye,
} from "lucide-angular";

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
    | string;
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
  selector: "tr[app-order-row]",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./order-row.component.html",
  styleUrl: "./order-row.component.css",
})
export class OrderRowComponent {
  @HostBinding("class.order-row") orderRowClass = true;

  @Input() order!: Order;
  @Input() actionLoading: { [orderId: string]: boolean } = {};

  @Output() statusChange = new EventEmitter<{
    orderId: string;
    event: Event;
  }>();
  @Output() paymentStatusChange = new EventEmitter<{
    orderId: string;
    event: Event;
  }>();
  @Output() deleteOrder = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<Order>();

  // Lucide icons
  readonly Clock = Clock;
  readonly Trash2 = Trash2;
  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;
  readonly Eye = Eye;

  // Event handlers
  onStatusChange(event: Event) {
    this.statusChange.emit({ orderId: this.order._id, event });
  }

  onPaymentStatusChange(event: Event) {
    this.paymentStatusChange.emit({ orderId: this.order._id, event });
  }

  onDeleteOrder() {
    this.deleteOrder.emit(this.order._id);
  }

  onViewDetails() {
    this.viewDetails.emit(this.order);
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600";
      case "on-the-way":
        return "text-blue-600";
      case "shipped":
        return "text-purple-600";
      case "delivered":
        return "text-green-600";
      case "canceled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600";
      case "paid":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  getTotalItems(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Customer info helper methods
  getCustomerName(order: Order): string {
    if (typeof order.userId === "object" && order.userId) {
      console.log(order);
      return `${order.userId.username}`;
    }
    return "N/A";
  }

  getCustomerEmail(order: Order): string {
    if (typeof order.userId === "object" && order.userId) {
      return order.userId.email;
    }
    return typeof order.userId === "string" ? order.userId : "N/A";
  }
}
