import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { BookInfoComponent } from "./pages/book-info/book-info.component";
import { DetailsComponent } from "./pages/book-info/details/details.component";
import { ScheduleComponent } from "./pages/book-info/schedule/schedule.component";
import { ReviewsComponent } from "./pages/book-info/reviews/reviews.component";
import { PreviewComponent } from "./pages/book-info/preview/preview.component";
import { adminRoutes } from "./pages/admin/admin.routes";
import { AdminGuard } from "./guards/admin.guard";
import { HomeComponent } from "./pages/home/home.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "book-info",
    component: BookInfoComponent,
    children: [
      { path: "", redirectTo: "detaills", pathMatch: "full" },
      { path: "details", component: DetailsComponent },
      { path: "schedule", component: ScheduleComponent },
      { path: "reviews", component: ReviewsComponent },
      { path: "preview", component: PreviewComponent },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "details",
      },
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
