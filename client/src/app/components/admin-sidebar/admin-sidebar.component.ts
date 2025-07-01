import { Component, Output, EventEmitter } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  Home,
  BookOpen,
  Users,
  ShoppingCart,
  Menu,
  X,
  Plus,
  List,
  LogOut,
} from "lucide-angular";

@Component({
  selector: "app-admin-sidebar",
  imports: [CommonModule, RouterLinkActive, RouterLink, LucideAngularModule],
  templateUrl: "./admin-sidebar.component.html",
  styleUrl: "./admin-sidebar.component.css",
})
export class AdminSidebarComponent {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  isCollapsed = false;
  isMobileMenuOpen = false;

  // Lucide icons
  readonly Home = Home;
  readonly BookOpen = BookOpen;
  readonly Users = Users;
  readonly ShoppingCart = ShoppingCart;
  readonly Menu = Menu;
  readonly X = X;
  readonly Plus = Plus;
  readonly List = List;
  readonly LogOut = LogOut;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggle.emit(this.isCollapsed);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  exitToHome() {
    this.router.navigate(["/"]);
  }
}
