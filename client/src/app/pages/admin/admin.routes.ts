import { Routes } from "@angular/router";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const adminRoutes: Routes = [
  {
    path: "",
    component: AdminPageComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        title: "Admin | Dashboard",
        component: DashboardComponent,
      },
      {
        path: "users",
        title: "Admin | Users",
        loadChildren: () =>
          import("./users/users.routes").then((m) => m.usersRoutes),
      },
      // { path: "orders", title: "Admin | Orders", component: OrdersComponent}.
      {
        path: "books",
        loadChildren: () =>
          import("./books/books.routes").then((m) => m.booksRoutes),
      },
      {
        path: "authors",
        loadChildren: () =>
          import("./authors/authors.routes").then((m) => m.authorsRoutes),
      },
    ],
  },
];
