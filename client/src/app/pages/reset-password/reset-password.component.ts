import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  LucideAngularModule,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-angular";
import { AuthApiService } from "../../services/auth-api.service";

@Component({
  selector: "app-reset-password",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
  ],
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage = "";
  passwordReset = false;
  tokenExpired = false;
  showPassword = false;
  showConfirmPassword = false;
  resetToken = "";

  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;
  readonly ArrowLeft = ArrowLeft;

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    // Initialize as not expired by default
    this.tokenExpired = false;

    // Check query parameters first
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams["token"]) {
        this.resetToken = queryParams["token"];
        this.tokenExpired = false;
        return; // Found token, no need to check route params
      }

      // If no query param token, check route parameters
      this.route.params.subscribe((routeParams) => {
        if (routeParams["token"]) {
          this.resetToken = routeParams["token"];
          this.tokenExpired = false;
        } else {
          // Only set expired if no token found in either place
          this.tokenExpired = true;
        }
      });
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get("password");
    const confirmPassword = group.get("confirmPassword");

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError("passwordMismatch")) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.resetPasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["minlength"])
        return "Password must be at least 8 characters";
      if (field.errors["passwordMismatch"]) return "Passwords do not match";
    }
    return "";
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = "";

      const password = this.resetPasswordForm.get("password")?.value;
      const confirmPassword =
        this.resetPasswordForm.get("confirmPassword")?.value;

      this.authApiService
        .resetPassword(this.resetToken, password, confirmPassword)
        .subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.passwordReset = true;
          },
          error: (error: any) => {
            console.error("Reset password failed:", error);
            this.isSubmitting = false;

            if (error.status === 0) {
              this.errorMessage =
                "Cannot connect to server. Please check your connection.";
            } else if (error.status === 400 || error.status === 401) {
              this.tokenExpired = true;
            } else {
              this.errorMessage =
                error.error?.message ||
                "Failed to reset password. Please try again.";
            }
          },
        });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }
}
