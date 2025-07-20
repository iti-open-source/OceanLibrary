import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  LucideAngularModule,
  X,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
} from "lucide-angular";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "app-change-password-modal",
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div
      *ngIf="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="onBackdropClick()"
    >
      <div
        class="bg-[var(--color-background-light)] rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        (click)="onModalClick($event)"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-[var(--color-border)]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-[var(--color-background-medium)] rounded-lg">
              <lucide-icon
                [img]="Lock"
                class="h-5 w-5 text-[var(--color-brand-primary)]"
              ></lucide-icon>
            </div>
            <h2 class="text-xl font-semibold text-[var(--color-text-heading)]">
              Change Password
            </h2>
          </div>
          <button
            type="button"
            (click)="onClose()"
            class="p-2 hover:bg-[var(--color-background-medium)] rounded-lg transition-colors"
          >
            <lucide-icon
              [img]="X"
              class="h-5 w-5 text-[var(--color-text-muted)]"
            ></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Error Message -->
          <div
            *ngIf="errorMessage"
            class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
          >
            <lucide-icon
              [img]="AlertCircle"
              class="h-5 w-5 flex-shrink-0"
            ></lucide-icon>
            <span class="text-sm">{{ errorMessage }}</span>
          </div>

          <!-- Success Message -->
          <div
            *ngIf="successMessage"
            class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2"
          >
            <lucide-icon
              [img]="AlertCircle"
              class="h-5 w-5 flex-shrink-0"
            ></lucide-icon>
            <span class="text-sm">{{ successMessage }}</span>
          </div>

          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
            <!-- Current Password -->
            <div class="mb-4">
              <label
                for="currentPassword"
                class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
              >
                Current Password
              </label>
              <div class="relative">
                <input
                  id="currentPassword"
                  [type]="showCurrentPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors pr-12"
                  [class.border-red-500]="isFieldInvalid('password')"
                  [class.border-[var(--color-border)]]="
                    !isFieldInvalid('password')
                  "
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  (click)="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                >
                  <lucide-icon
                    [img]="showCurrentPassword ? EyeOff : Eye"
                    class="h-5 w-5"
                  ></lucide-icon>
                </button>
              </div>
              <div
                *ngIf="isFieldInvalid('password')"
                class="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <lucide-icon [img]="AlertCircle" class="h-4 w-4"></lucide-icon>
                {{ getFieldError("password") }}
              </div>
            </div>

            <!-- New Password -->
            <div class="mb-4">
              <label
                for="newPassword"
                class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
              >
                New Password
              </label>
              <div class="relative">
                <input
                  id="newPassword"
                  [type]="showNewPassword ? 'text' : 'password'"
                  formControlName="newPassword"
                  class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors pr-12"
                  [class.border-red-500]="isFieldInvalid('newPassword')"
                  [class.border-[var(--color-border)]]="
                    !isFieldInvalid('newPassword')
                  "
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  (click)="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                >
                  <lucide-icon
                    [img]="showNewPassword ? EyeOff : Eye"
                    class="h-5 w-5"
                  ></lucide-icon>
                </button>
              </div>
              <div
                *ngIf="isFieldInvalid('newPassword')"
                class="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <lucide-icon [img]="AlertCircle" class="h-4 w-4"></lucide-icon>
                {{ getFieldError("newPassword") }}
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="mb-6">
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
              >
                Confirm New Password
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors pr-12"
                  [class.border-red-500]="isFieldInvalid('confirmPassword')"
                  [class.border-[var(--color-border)]]="
                    !isFieldInvalid('confirmPassword')
                  "
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  (click)="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
                >
                  <lucide-icon
                    [img]="showConfirmPassword ? EyeOff : Eye"
                    class="h-5 w-5"
                  ></lucide-icon>
                </button>
              </div>
              <div
                *ngIf="isFieldInvalid('confirmPassword')"
                class="mt-1 text-sm text-red-600 flex items-center gap-1"
              >
                <lucide-icon [img]="AlertCircle" class="h-4 w-4"></lucide-icon>
                {{ getFieldError("confirmPassword") }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 justify-end">
              <button
                type="button"
                (click)="onClose()"
                class="px-4 py-2 text-[var(--color-text-default)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background-medium)] transition-colors"
                [disabled]="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="passwordForm.invalid || isSubmitting"
                class="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on-dark)] rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSubmitting">Change Password</span>
                <span *ngIf="isSubmitting">Changing...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Custom styles if needed */
    `,
  ],
})
export class ChangePasswordModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  passwordForm: FormGroup;
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  readonly X = X;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.passwordForm = this.fb.group(
      {
        password: ["", [Validators.required, Validators.minLength(8)]],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator,
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecial) {
      return null;
    }

    return { invalidPassword: true };
  }

  passwordMatchValidator(group: any) {
    const newPassword = group.get("newPassword")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["minlength"]) return `Must be at least 8 characters`;
      if (field.errors["invalidPassword"])
        return "Password must contain uppercase, lowercase, number and special character";
      if (
        fieldName === "confirmPassword" &&
        this.passwordForm.errors?.["passwordMismatch"]
      ) {
        return "Passwords do not match";
      }
    }
    return "";
  }

  onSubmit() {
    if (this.passwordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = "";
      this.successMessage = "";

      const { password, newPassword, confirmPassword } = this.passwordForm.value;

      this.profileService.changePassword({ 
        password, 
        newPassword,
        confirmNewPassword: confirmPassword 
      }).subscribe({
        next: (response) => {
          this.successMessage = "Password changed successfully!";
          this.isSubmitting = false;
          setTimeout(() => {
            this.success.emit();
            this.onClose();
          }, 1500);
        },
        error: (error) => {
          console.error("Change password failed:", error);
          if (error.status === 400) {
            this.errorMessage =
              error.error?.message || "Incorrect current password";
          } else if (error.status === 0) {
            this.errorMessage =
              "Cannot connect to server. Please check your connection.";
          } else {
            this.errorMessage =
              error.error?.message ||
              "Failed to change password. Please try again.";
          }
          this.isSubmitting = false;
        },
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  onClose() {
    this.passwordForm.reset();
    this.errorMessage = "";
    this.successMessage = "";
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.close.emit();
  }

  onBackdropClick() {
    this.onClose();
  }

  onModalClick(event: Event) {
    event.stopPropagation();
  }
}
