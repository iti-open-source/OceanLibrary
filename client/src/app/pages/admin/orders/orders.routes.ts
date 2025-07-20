import { Routes } from "@angular/router";
import { OrdersPageComponent } from "./orders-page/orders-page.component";

export const ordersRoutes: Routes = [
  {
    path: "",
    component: OrdersPageComponent,
    title: "Orders Management",
  },
];
