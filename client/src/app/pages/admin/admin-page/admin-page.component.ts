import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-admin-page",
  imports: [RouterModule, SidebarComponent],
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent {}
