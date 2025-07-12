import { Component, OnDestroy, OnInit, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule } from "lucide-angular";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, CommonModule, LucideAngularModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  profileMenuOpen = false;
  mobileProfileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router, private elRef: ElementRef) {}

  ngOnInit() {
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  handleDocumentClick = (event: MouseEvent) => {
    if (
      this.profileMenuOpen &&
      this.elRef.nativeElement &&
      !this.elRef.nativeElement.contains(event.target)
    ) {
      this.profileMenuOpen = false;
    }
  };

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  signOut() {
    this.profileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
