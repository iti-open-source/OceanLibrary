import { Routes } from "@angular/router";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BooksComponent } from "./books/books.component";
import { UsersComponent } from "./users/users.component";

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
      { path: "users", title: "Admin | Users", component: UsersComponent },
      { path: "books", title: "Admin | Books", component: BooksComponent },
    ],
  },
];
