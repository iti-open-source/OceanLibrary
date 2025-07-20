import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
  LucideAngularModule,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-angular";
import { AuthApiService } from "../../services/auth-api.service";

@Component({
  selector: "app-forgot-password",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
  ],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.css",
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  errorMessage = "";
  emailSent = false;
  resendCooldown = 0;

  readonly Mail = Mail;
  readonly ArrowLeft = ArrowLeft;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;

  constructor(
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"]) return "Email is required";
      if (field.errors["email"]) return "Please enter a valid email address";
    }
    return "";
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = "";

      const email = this.forgotPasswordForm.get("email")?.value;

      this.authApiService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.emailSent = true;
          this.startResendCooldown();
        },
        error: (error: any) => {
          console.error("Forgot password failed:", error);
          this.isSubmitting = false;

          if (error.status === 0) {
            this.errorMessage =
              "Cannot connect to server. Please check your connection.";
          } else if (error.status === 404) {
            this.errorMessage = "No account found with this email address.";
          } else {
            this.errorMessage =
              error.error?.message ||
              "Failed to send reset email. Please try again.";
          }
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  resendEmail() {
    if (this.resendCooldown === 0) {
      this.emailSent = false;
      this.onSubmit();
    }
  }

  private startResendCooldown() {
    this.resendCooldown = 60; // 60 seconds cooldown
    const interval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
}
