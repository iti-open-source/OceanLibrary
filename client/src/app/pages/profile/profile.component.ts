import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  ShieldCheck,
  Calendar,
  Edit,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-angular";
import { ProfileService } from "../../services/profile.service";
import { AuthService } from "../../services/auth.service";
import { User as UserInterface } from "../../types/user.interface";
import { ChangePasswordModalComponent } from "../../components/change-password-modal/change-password-modal.component";
import { EditProfileModalComponent } from "../../components/edit-profile-modal/edit-profile-modal.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: "app-profile",
  imports: [
    CommonModule,
    LucideAngularModule,
    ChangePasswordModalComponent,
    EditProfileModalComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  user: UserInterface | null = null;
  loading = true;
  error = "";
  showChangePasswordModal = false;
  showEditProfileModal = false;

  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Shield = Shield;
  readonly ShieldCheck = ShieldCheck;
  readonly Calendar = Calendar;
  readonly Edit = Edit;
  readonly Lock = Lock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.error = "";

    this.profileService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Failed to load user profile:", error);
        this.error = "Failed to load profile. Please try again.";
        this.loading = false;
      },
    });
  }

  getRoleBadgeClass(): string {
    if (!this.user) return "";
    switch (this.user.role) {
      case "super-admin":
        return "badge-super-admin";
      case "admin":
        return "badge-admin";
      default:
        return "badge-user";
    }
  }

  getRoleIcon() {
    if (!this.user) return User;
    switch (this.user.role) {
      case "super-admin":
        return ShieldCheck;
      case "admin":
        return Shield;
      default:
        return User;
    }
  }

  getRoleDisplayText(): string {
    if (!this.user) return "";
    switch (this.user.role) {
      case "super-admin":
        return "Super Administrator";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  openEditProfileModal() {
    this.showEditProfileModal = true;
  }

  closeEditProfileModal() {
    this.showEditProfileModal = false;
  }

  onProfileUpdated(updatedUser: UserInterface) {
    this.user = updatedUser;
    this.showEditProfileModal = false;
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }

  onPasswordChanged() {
    this.showChangePasswordModal = false;
  }

  retry() {
    this.loadUserProfile();
  }
}
