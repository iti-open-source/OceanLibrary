import { Component, OnDestroy, OnInit, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  Package,
  Settings,
  User,
  LogOut,
  Home,
  Compass,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  LogIn,
  UserPlus,
  Sun,
  Moon,
} from "lucide-angular";
import { RouterLink, Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { User as UserInterface } from "../../types/user.interface";
import {
  AutocompleteSearchComponent,
  AutocompleteOption,
} from "../autocomplete-search/autocomplete-search.component";
import { filter, Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    LucideAngularModule,
    AutocompleteSearchComponent,
  ],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  profileMenuOpen = false;
  mobileMenuOpen = false;
  currentRoute = "";
  isLoggedIn = false;
  isAdmin = false;
  currentUser: UserInterface | null = null;
  isDarkMode = false;
  private destroy$ = new Subject<void>();

  // Lucide icons
  readonly Package = Package;
  readonly Settings = Settings;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Home = Home;
  readonly Compass = Compass;
  readonly ShoppingCart = ShoppingCart;
  readonly ChevronDown = ChevronDown;
  readonly Menu = Menu;
  readonly X = X;
  readonly LogIn = LogIn;
  readonly UserPlus = UserPlus;
  readonly Sun = Sun;
  readonly Moon = Moon;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    // Initialize dark mode
    this.initializeDarkMode();

    document.addEventListener("click", this.handleDocumentClick, true);

    // Subscribe to authentication state changes
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        this.isAdmin = isAuthenticated ? this.authService.isAdmin() : false;

        // Load user profile when authenticated
        if (isAuthenticated) {
          this.loadCurrentUser();
        } else {
          this.currentUser = null;
        }
      });

    // Subscribe to router events to track current route
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });

    // Set initial route
    this.currentRoute = this.router.url;

    // Load user profile if already authenticated
    if (this.isLoggedIn) {
      this.loadCurrentUser();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener("click", this.handleDocumentClick, true);
    document.body.classList.remove("mobile-menu-open");
  }

  handleDocumentClick = (event: MouseEvent) => {
    if (
      (this.profileMenuOpen || this.mobileMenuOpen) &&
      this.elRef.nativeElement &&
      !this.elRef.nativeElement.contains(event.target)
    ) {
      this.profileMenuOpen = false;
      this.mobileMenuOpen = false;
    }
  };

  // Handle keyboard navigation for dropdown
  onProfileButtonKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.profileMenuOpen = !this.profileMenuOpen;
    } else if (event.key === "Escape") {
      this.profileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Close profile menu if it's open
    if (this.mobileMenuOpen) {
      this.profileMenuOpen = false;
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.classList.remove("mobile-menu-open");
  }

  signOut() {
    this.profileMenuOpen = false;
    this.mobileMenuOpen = false;
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  navigateToAdmin() {
    this.profileMenuOpen = false;
    this.mobileMenuOpen = false;
    this.router.navigate(["/admin"]);
  }

  navigateToOrders() {
    this.profileMenuOpen = false;
    this.mobileMenuOpen = false;
    this.router.navigate(["/orders"]);
  }

  onSearchSelected(searchTerm: string) {
    // Navigate to browse page with search term
    this.router.navigate(["/browse"], { queryParams: { search: searchTerm } });
    this.closeMobileMenu();
  }

  onSuggestionSelected(suggestion: AutocompleteOption) {
    // Since we only have books now, always navigate to book details
    this.router.navigate([`/book-info/${suggestion.id}/details`]);
    this.closeMobileMenu();
  }

  isRouteActive(route: string): boolean {
    if (route === "") {
      // For home route, check if we're exactly at root or just '/'
      return this.currentRoute === "/" || this.currentRoute === "";
    }
    return this.currentRoute.startsWith(`/${route}`);
  }

  getNavLinkClass(route: string): string {
    const baseClass =
      "nav-link cursor-pointer flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)] transition-all duration-200 px-2 py-1";
    return this.isRouteActive(route) ? `${baseClass} active` : baseClass;
  }

  getMobileNavLinkClass(route: string): string {
    const baseClass =
      "flex items-center px-4 py-3 rounded-lg text-[var(--color-text-default)] hover:bg-[var(--color-background-medium)] hover:text-[var(--color-brand-primary)] transition-all duration-200";
    const activeClass =
      "bg-[var(--color-background-medium)] text-[var(--color-brand-primary)] font-semibold";
    return this.isRouteActive(route)
      ? `${baseClass} ${activeClass}`
      : baseClass;
  }

  loadCurrentUser() {
    if (this.isLoggedIn) {
      this.profileService
        .getCurrentUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.currentUser = response.data;
          },
          error: (error) => {
            console.error("Failed to load user profile:", error);
            this.currentUser = null;
          },
        });
    }
  }

  initializeDarkMode() {
    const theme = localStorage.getItem("theme");
    this.isDarkMode = theme === "dark";

    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }
}
