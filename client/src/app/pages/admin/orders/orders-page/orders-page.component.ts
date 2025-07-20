import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdersListComponent } from "../orders-list/orders-list.component";

@Component({
  selector: "app-orders-page",
  standalone: true,
  imports: [CommonModule, OrdersListComponent],
  templateUrl: "./orders-page.component.html",
  styleUrl: "./orders-page.component.css",
})
export class OrdersPageComponent {}
