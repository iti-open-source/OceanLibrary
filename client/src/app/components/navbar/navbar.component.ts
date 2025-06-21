import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  mobileMenuOpen = false;
  profileMenuOpen = false;
  mobileProfileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
