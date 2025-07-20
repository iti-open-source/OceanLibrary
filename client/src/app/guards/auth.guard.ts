import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    // User is not logged in, redirect to login page
    this.router.navigate(["/login"]);
    return false;
  }
}
