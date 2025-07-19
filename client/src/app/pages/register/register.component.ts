import { AuthApiService } from "./../../services/auth-api.service";
import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { registerationData } from "../../types/registerationData";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-register",
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = "";

  constructor(
    private authApi: AuthApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(32),
            Validators.pattern(/^[a-zA-Z0-9]+$/),
          ],
        ],
        email: ["", [Validators.required, Validators.email]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,}$/
            ),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
        phone: [
          "",
          [Validators.required, Validators.pattern(/^(\+20|0)?1[0125]\d{8}$/)],
        ],
        address: this.fb.group({
          street: ["", [Validators.required, Validators.maxLength(128)]],
          city: ["", [Validators.required, Validators.maxLength(32)]],
          country: ["", [Validators.required, Validators.maxLength(32)]],
          zip: [
            "",
            [
              Validators.required,
              Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/),
              Validators.minLength(5),
              Validators.maxLength(10),
            ],
          ],
        }),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError("passwordMismatch")) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = "";

      const formData: registerationData = this.registerForm.value;
      console.log("Submitting registration data:", formData);

      this.authApi.register(formData).subscribe({
        next: (response) => {
          console.log("Registration successful:", response);
          // Redirect to login page
          this.router.navigate(["/login"]);
        },
        error: (error) => {
          console.error("Registration failed:", error);
          if (error.status === 0) {
            this.errorMessage =
              "Cannot connect to server. Please check your internet connection.";
          } else if (error.status === 400 && error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 409) {
            this.errorMessage =
              "Email or username already exists. Please use different credentials.";
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              "Registration failed. Please check your information and try again.";
          }
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
      console.log("Form validation errors:", this.registerForm.errors);
      this.errorMessage = "Please correct the errors below and try again.";
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isAddressFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(`address.${fieldName}`);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors["email"]) {
        return "Please enter a valid email address";
      }
      if (field.errors["minlength"]) {
        const requiredLength = field.errors["minlength"].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${requiredLength} characters`;
      }
      if (field.errors["maxlength"]) {
        const requiredLength = field.errors["maxlength"].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } cannot exceed ${requiredLength} characters`;
      }
      if (field.errors["pattern"]) {
        switch (fieldName) {
          case "username":
            return "Username can only contain letters and numbers";
          case "password":
            return "Password must contain at least 8 characters including uppercase, lowercase, number, and special character";
          case "phone":
            return "Please enter a valid Egyptian phone number (e.g., 01012345678)";
          default:
            return "Invalid format";
        }
      }
      if (field.errors["passwordMismatch"]) {
        return "Passwords do not match";
      }
    }
    return "";
  }

  getAddressFieldError(fieldName: string): string {
    const field = this.registerForm.get(`address.${fieldName}`);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors["required"]) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors["maxlength"]) {
        const requiredLength = field.errors["maxlength"].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } cannot exceed ${requiredLength} characters`;
      }
      if (field.errors["pattern"]) {
        if (fieldName === "zip") {
          return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
        }
        return "Invalid format";
      }
      if (field.errors["minlength"]) {
        const requiredLength = field.errors["minlength"].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${requiredLength} characters`;
      }
    }
    return "";
  }
}
