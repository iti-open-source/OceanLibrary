import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersListComponent } from "../users-list/users-list.component";

@Component({
  selector: "app-users-page",
  standalone: true,
  imports: [CommonModule, UsersListComponent],
  templateUrl: "./users-page.component.html",
  styleUrl: "./users-page.component.css",
})
export class UsersPageComponent {}
