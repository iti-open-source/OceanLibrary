import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { filter } from "rxjs";
import { ModeSwitcherComponent } from "./components/mode-switcher/mode-switcher.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: "app-root",
  imports: [
    CommonModule,
    RouterOutlet,
    ModeSwitcherComponent,
    FooterComponent,
    NavbarComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "ocean library";
  isAdminRoute = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes to determine if we're on admin routes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isAdminRoute = event.url.startsWith("/admin");
      });
  }
}
