import { BooksService } from "./../../../services/books.service";
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AdminSidebarComponent } from "../../../components/admin-sidebar/admin-sidebar.component";
import { Fields } from "../../../types/queryEnums";

@Component({
  selector: "app-admin-page",
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: "./admin-page.component.html",
  styleUrl: "./admin-page.component.css",
})
export class AdminPageComponent {
  private BooksService = inject(BooksService);
  isSidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  // ngOnInit() {
  //   this.BooksService.getAllBooks({
  //     fields: [Fields.AUTHOR_NAME, Fields.TITLE],
  //   }).subscribe({
  //     next: (data) => console.log(data),
  //     error: (err) => console.log(err),
  //   });
  // }
}
