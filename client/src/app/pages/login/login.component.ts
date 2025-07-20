import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthApiService } from "../../services/auth-api.service";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";

@Component({
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  isDarkMode = false;
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = "";
  showError = false;

  constructor(
    private renderer: Renderer2,
    private authApi: AuthApiService,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private cart: CartService
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains("dark-mode");
    this.setBodyClass(this.isDarkMode);
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = "";
      this.showError = false;

      const { email, password } = this.loginForm.value;

      this.authApi.login(email, password).subscribe({
        next: (response) => {
          // The backend returns {status: "success", data: "token"}
          const token = response.data;

          if (!token) {
            console.error("No token received in response");
            this.errorMessage =
              "Login failed: No authentication token received";
            this.triggerErrorBar();
            this.isSubmitting = false;
            return;
          }

          // Store the token using AuthService
          this.auth.login(token);

          // Check user role and redirect accordingly
          // Wait a bit to ensure token is stored before decoding
          setTimeout(() => {
            // Sync cart
            this.cart.syncCart();

            const userRole = this.auth.getUserRole();

            if (this.auth.isAdmin() || this.auth.isSuperAdmin()) {
              this.router.navigate(["/admin"]);
            } else {
              this.router.navigate(["/"]);
            }
          }, 100);
        },
        error: (error) => {
          console.error("Login failed:", error);
          if (error.status === 0) {
            this.errorMessage =
              "Cannot connect to server. Please check your internet connection.";
          } else if (error.status === 401) {
            this.errorMessage = "Invalid email or password.";
          } else if (error.status === 403) {
            this.errorMessage =
              "Your account has been disabled. Please contact support.";
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = "Login failed. Please try again.";
          }
          this.triggerErrorBar();
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
      this.errorMessage = "Please enter valid email and password.";
      this.triggerErrorBar();
    }
  }

  triggerErrorBar() {
    this.showError = false;
    setTimeout(() => {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 1000);
    }, 10);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["email"]) return "Please enter a valid email";
      if (field.errors["minlength"])
        return `${fieldName} must be at least ${field.errors["minlength"].requiredLength} characters`;
    }
    return "";
  }

  toggleDarkMode(event: Event) {
    this.isDarkMode = (event.target as HTMLInputElement).checked;
    this.setBodyClass(this.isDarkMode);
  }

  setBodyClass(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.body, "dark-mode");
    } else {
      this.renderer.removeClass(document.body, "dark-mode");
    }
  }
}
