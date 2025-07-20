// admin.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  private isAdmin() {
    return this.auth.isAdmin();
  }

  private isSuperAdmin() {
    return this.auth.isSuperAdmin();
  }

  canActivate(): boolean {
    if (this.isAdmin() || this.isSuperAdmin()) {
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
