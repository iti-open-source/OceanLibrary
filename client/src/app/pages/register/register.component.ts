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
        username: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
        phone: ["", [Validators.required]],
        address: this.fb.group({
          street: ["", [Validators.required]],
          city: ["", [Validators.required]],
          country: ["", [Validators.required]],
          zip: ["", [Validators.required]],
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

      this.authApi.register(formData).subscribe({
        next: (response) => {
          console.log(`Response: ${response}`);
          // Redirect to login or dashboard
          this.router.navigate(["/login"]);
        },
        error: (error) => {
          console.error("Registration failed:", error);
          this.errorMessage =
            error.error?.message || "Registration failed. Please try again.";
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
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
    if (field?.errors) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["email"]) return "Please enter a valid email";
      if (field.errors["minlength"])
        return `${fieldName} must be at least ${field.errors["minlength"].requiredLength} characters`;
      if (field.errors["passwordMismatch"]) return "Passwords do not match";
    }
    return "";
  }

  getAddressFieldError(fieldName: string): string {
    const field = this.registerForm.get(`address.${fieldName}`);
    if (field?.errors?.["required"]) {
      return `${fieldName} is required`;
    }
    return "";
  }
}
