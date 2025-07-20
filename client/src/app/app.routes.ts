import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { BookInfoComponent } from "./pages/book-info/book-info.component";
import { DetailsComponent } from "./pages/book-info/details/details.component";
import { ReviewsComponent } from "./pages/book-info/reviews/reviews.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { adminRoutes } from "./pages/admin/admin.routes";
import { AdminGuard } from "./guards/admin.guard";
import { GuestGuard } from "./guards/guest.guard";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./pages/home/home.component";
import { CartComponent } from "./pages/cart/cart.component";
import { BrowseComponent } from "./pages/browse/browse.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "browse",
    component: BrowseComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "book-info/:bookID",
    component: BookInfoComponent,
    children: [
      { path: "", redirectTo: "details", pathMatch: "full" },
      { path: "details", component: DetailsComponent },
      { path: "reviews", component: ReviewsComponent },
    ],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./pages/admin/admin.routes").then((m) => m.adminRoutes),
    canActivate: [AdminGuard],
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
