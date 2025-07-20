import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs";
import {
  LucideAngularModule,
  Users,
  Search,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Ban,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  UserPlus,
  UserMinus,
  Unlock,
} from "lucide-angular";

import { UsersService } from "../../../../services/users.service";
import { AuthService } from "../../../../services/auth.service";
import { User } from "../../../../types/user.interface";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";

@Component({
  selector: "app-users-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ErrorModalComponent,
  ],
  templateUrl: "./users-list.component.html",
  styleUrl: "./users-list.component.css",
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  totalUsers = 0;

  // Search and filtering
  searchTerm = "";
  roleFilter = "all"; // 'all', 'user', 'admin', 'super-admin'
  statusFilter = "all"; // 'all', 'active', 'banned'

  // User actions
  actionLoading: { [userId: string]: boolean } = {};

  // Error modal
  showErrorModal = false;
  errorModalTitle = "Error";
  errorModalMessage = "";
  errorModalShowAction = false;
  errorModalActionText = "Try Again";

  // Current user info
  currentUserRole: string = "";
  isSuperAdmin = false;

  // Utility
  Math = Math;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  // Lucide icons
  readonly Users = Users;
  readonly Search = Search;
  readonly Shield = Shield;
  readonly ShieldCheck = ShieldCheck;
  readonly UserIcon = UserIcon;
  readonly Ban = Ban;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly MoreVertical = MoreVertical;
  readonly UserPlus = UserPlus;
  readonly UserMinus = UserMinus;
  readonly Unlock = Unlock;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {
    this.currentUserRole = this.authService.getUserRole() || "";
    this.isSuperAdmin = this.authService.isSuperAdmin();
  }

  ngOnInit() {
    // Setup debounced search
    this.searchSubject$
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadUsers();
      });

    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.usersService
      .getAllUsers(
        this.currentPage,
        this.itemsPerPage,
        this.searchTerm || undefined,
        this.roleFilter !== "all" ? this.roleFilter : undefined,
        this.statusFilter !== "all" ? this.statusFilter : undefined
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === "success") {
            this.users = response.data;
            // Update pagination info from backend response
            if (response.pagination) {
              this.totalUsers = response.pagination.totalUsers;
              this.totalPages = response.pagination.totalPages;
              this.currentPage = response.pagination.currentPage;
            } else {
              // Fallback for backward compatibility
              this.totalUsers = response.data.length;
              this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
            }
          }
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading users:", error);
          this.error = this.getErrorMessage(error);
          this.loading = false;
          this.showError("Load Error", this.error);
        },
      });
  }

  onSearch() {
    // Trigger debounced search
    this.searchSubject$.next(this.searchTerm);
  }

  onSearchInput(event: any) {
    // Update search term and trigger debounced search
    this.searchSubject$.next(event.target.value);
  }

  onRoleFilterChange() {
    // Reset to first page when filtering
    this.currentPage = 1;
    this.loadUsers();
  }

  onStatusFilterChange() {
    // Reset to first page when filtering
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  // User actions
  promoteUser(userId: string) {
    if (this.actionLoading[userId]) return;

    this.actionLoading[userId] = true;
    this.usersService
      .promoteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === "success") {
            this.loadUsers(); // Refresh the list
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error promoting user:", error);
          this.actionLoading[userId] = false;
          this.showError("Promotion Error", this.getErrorMessage(error));
        },
      });
  }

  demoteUser(userId: string) {
    if (this.actionLoading[userId]) return;

    this.actionLoading[userId] = true;
    this.usersService
      .demoteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === "success") {
            this.loadUsers(); // Refresh the list
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error demoting user:", error);
          this.actionLoading[userId] = false;
          this.showError("Demotion Error", this.getErrorMessage(error));
        },
      });
  }

  banUser(userId: string) {
    if (this.actionLoading[userId]) return;

    this.actionLoading[userId] = true;
    this.usersService
      .banUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === "success") {
            this.loadUsers(); // Refresh the list
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error banning user:", error);
          this.actionLoading[userId] = false;
          this.showError("Ban Error", this.getErrorMessage(error));
        },
      });
  }

  unbanUser(userId: string) {
    if (this.actionLoading[userId]) return;

    this.actionLoading[userId] = true;
    this.usersService
      .unbanUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === "success") {
            this.loadUsers(); // Refresh the list
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error unbanning user:", error);
          this.actionLoading[userId] = false;
          this.showError("Unban Error", this.getErrorMessage(error));
        },
      });
  }

  // Utility methods
  canPromoteUser(user: User): boolean {
    // Only superadmin can promote users to admin
    return this.isSuperAdmin && user.role === "user";
  }

  canDemoteUser(user: User): boolean {
    // Only superadmin can demote admins to user
    return this.isSuperAdmin && user.role === "admin";
  }

  canBanUser(user: User): boolean {
    if (!user.active) return false; // Already banned
    if (user.role === "super-admin") return false; // Cannot ban super admin
    if (user.role === "admin" && !this.isSuperAdmin) return false; // Only super admin can ban admin
    return true;
  }

  canUnbanUser(user: User): boolean {
    if (user.active) return false; // Not banned
    if (user.role === "super-admin") return false; // Cannot unban super admin
    if (user.role === "admin" && !this.isSuperAdmin) return false; // Only super admin can unban admin
    return true;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case "super-admin":
        return "badge-super-admin";
      case "admin":
        return "badge-admin";
      default:
        return "badge-user";
    }
  }

  getStatusBadgeClass(active: boolean): string {
    return active ? "badge-active" : "badge-banned";
  }

  // Error handling
  private showError(
    title: string,
    message: string,
    showAction = false,
    actionCallback?: () => void
  ) {
    this.errorModalTitle = title;
    this.errorModalMessage = message;
    this.errorModalShowAction = showAction;
    this.showErrorModal = true;

    if (actionCallback) {
      this.errorActionCallback = actionCallback;
    }
  }

  onErrorModalClose() {
    this.showErrorModal = false;
  }

  onErrorModalAction() {
    this.showErrorModal = false;
    if (this.errorActionCallback) {
      this.errorActionCallback();
    }
  }

  private errorActionCallback?: () => void;

  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "An unexpected error occurred";
  }
}
