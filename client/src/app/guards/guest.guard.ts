import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class GuestGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      // User is logged in, redirect to home page
      this.router.navigate(["/"]);
      return false;
    }
    // User is not logged in, allow access to login/register
    return true;
  }
}
