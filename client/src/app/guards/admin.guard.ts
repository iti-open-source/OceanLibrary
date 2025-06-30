// admin.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  private isAdmin() {
    return true;
  }

  canActivate(): boolean {
    if (this.isAdmin()) {
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
