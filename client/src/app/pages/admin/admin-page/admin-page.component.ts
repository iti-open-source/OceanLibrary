import { BooksService } from "./../../../services/books.service";
import { Component, inject } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "app-admin-page",
  imports: [RouterModule, SidebarComponent],
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent {
  private BooksService = inject(BooksService);

  ngOnInit() {
    this.BooksService.getAllBooks().subscribe({
      next: (data) => console.log(data),
      error: (err) => console.log(err),
    });
  }
}
