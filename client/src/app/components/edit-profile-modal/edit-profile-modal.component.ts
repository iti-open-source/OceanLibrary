import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
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
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-angular";
import {
  ProfileService,
  UpdateProfileRequest,
} from "../../services/profile.service";
import { User as UserInterface } from "../../types/user.interface";

@Component({
  selector: "app-edit-profile-modal",
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div
      *ngIf="isVisible"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      (click)="onBackdropClick()"
    >
      <div
        class="bg-[var(--color-background-light)] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        (click)="onModalClick($event)"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-[var(--color-border)]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-[var(--color-background-medium)] rounded-lg">
              <lucide-icon
                [img]="User"
                class="h-5 w-5 text-[var(--color-brand-primary)]"
              ></lucide-icon>
            </div>
            <h2 class="text-xl font-semibold text-[var(--color-text-heading)]">
              Edit Profile
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

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <!-- Personal Information -->
            <div class="mb-6">
              <h3
                class="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center gap-2"
              >
                <lucide-icon [img]="User" class="h-5 w-5"></lucide-icon>
                Personal Information
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Username -->
                <div>
                  <label
                    for="username"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    formControlName="username"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('username')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('username')
                    "
                    placeholder="Enter your username"
                  />
                  <div
                    *ngIf="isFieldInvalid('username')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("username") }}
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('email')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('email')
                    "
                    placeholder="Enter your email"
                  />
                  <div
                    *ngIf="isFieldInvalid('email')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("email") }}
                  </div>
                </div>

                <!-- Phone -->
                <div class="md:col-span-2">
                  <label
                    for="phone"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    formControlName="phone"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('phone')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('phone')
                    "
                    placeholder="Enter your phone number"
                  />
                  <div
                    *ngIf="isFieldInvalid('phone')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("phone") }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div class="mb-6">
              <h3
                class="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center gap-2"
              >
                <lucide-icon [img]="MapPin" class="h-5 w-5"></lucide-icon>
                Address Information
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Street -->
                <div class="md:col-span-2">
                  <label
                    for="street"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    formControlName="street"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('street')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('street')
                    "
                    placeholder="Enter your street address"
                  />
                  <div
                    *ngIf="isFieldInvalid('street')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("street") }}
                  </div>
                </div>

                <!-- City -->
                <div>
                  <label
                    for="city"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    formControlName="city"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('city')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('city')
                    "
                    placeholder="Enter your city"
                  />
                  <div
                    *ngIf="isFieldInvalid('city')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("city") }}
                  </div>
                </div>

                <!-- Country -->
                <div>
                  <label
                    for="country"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    formControlName="country"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('country')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('country')
                    "
                    placeholder="Enter your country"
                  />
                  <div
                    *ngIf="isFieldInvalid('country')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("country") }}
                  </div>
                </div>

                <!-- ZIP Code -->
                <div class="md:col-span-2">
                  <label
                    for="zip"
                    class="block text-sm font-medium text-[var(--color-text-heading)] mb-2"
                  >
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    formControlName="zip"
                    class="w-full px-4 py-2.5 border rounded-lg bg-[var(--color-background-light)] text-[var(--color-text-default)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-colors"
                    [class.border-red-500]="isFieldInvalid('zip')"
                    [class.border-[var(--color-border)]]="
                      !isFieldInvalid('zip')
                    "
                    placeholder="Enter your ZIP code"
                  />
                  <div
                    *ngIf="isFieldInvalid('zip')"
                    class="mt-1 text-sm text-red-600 flex items-center gap-1"
                  >
                    <lucide-icon
                      [img]="AlertCircle"
                      class="h-4 w-4"
                    ></lucide-icon>
                    {{ getFieldError("zip") }}
                  </div>
                </div>
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
                [disabled]="profileForm.invalid || isSubmitting"
                class="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-on-dark)] rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isSubmitting">Save Changes</span>
                <span *ngIf="isSubmitting">Saving...</span>
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
export class EditProfileModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() user: UserInterface | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<UserInterface>();

  profileForm: FormGroup;
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";

  readonly X = X;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly AlertCircle = AlertCircle;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      street: ["", [Validators.maxLength(128)]],
      city: ["", [Validators.maxLength(32)]],
      country: ["", [Validators.maxLength(32)]],
      zip: ["", [Validators.pattern(/^\d{5}(?:[-\s]\d{4})?$/)]],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        phone: this.user.phone,
        street: this.user.address?.street || "",
        city: this.user.address?.city || "",
        country: this.user.address?.country || "",
        zip: this.user.address?.zip || "",
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["email"]) return "Please enter a valid email";
      if (field.errors["minlength"])
        return `Must be at least ${field.errors["minlength"].requiredLength} characters`;
      if (field.errors["maxlength"])
        return `Cannot exceed ${field.errors["maxlength"].requiredLength} characters`;
      if (field.errors["pattern"] && fieldName === "zip")
        return "Please enter a valid ZIP code";
    }
    return "";
  }

  onSubmit() {
    if (this.profileForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = "";
      this.successMessage = "";

      const formValue = this.profileForm.value;
      const updateData: UpdateProfileRequest = {
        username: formValue.username,
        email: formValue.email,
        phone: formValue.phone,
        address: {
          street: formValue.street,
          city: formValue.city,
          country: formValue.country,
          zip: formValue.zip,
        },
      };

      this.profileService.updateProfile(updateData).subscribe({
        next: (response) => {
          this.successMessage = "Profile updated successfully!";
          this.isSubmitting = false;

          // Update the user object with new data
          if (this.user) {
            this.user.username = formValue.username;
            this.user.email = formValue.email;
            this.user.phone = formValue.phone;
            this.user.address = {
              street: formValue.street,
              city: formValue.city,
              country: formValue.country,
              zip: formValue.zip,
            };
          }

          setTimeout(() => {
            this.success.emit(this.user!);
            this.onClose();
          }, 1500);
        },
        error: (error) => {
          console.error("Update profile failed:", error);
          if (error.status === 0) {
            this.errorMessage =
              "Cannot connect to server. Please check your connection.";
          } else {
            this.errorMessage =
              error.error?.message ||
              "Failed to update profile. Please try again.";
          }
          this.isSubmitting = false;
        },
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  onClose() {
    this.errorMessage = "";
    this.successMessage = "";
    this.close.emit();
  }

  onBackdropClick() {
    this.onClose();
  }

  onModalClick(event: Event) {
    event.stopPropagation();
  }
}
