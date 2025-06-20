import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { BookInfoComponent } from "./pages/book-info/book-info.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: 'book-info',
    component: BookInfoComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
