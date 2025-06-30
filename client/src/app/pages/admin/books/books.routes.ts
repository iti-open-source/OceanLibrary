import { Routes } from "@angular/router";
import { BooksPageComponent } from "./books-page/books-page.component";
import { BooksListComponent } from "./books-list/books-list.component";
import { BooksFormComponent } from "./books-form/books-form.component";

export const booksRoutes: Routes = [
  {
    path: "",
    component: BooksPageComponent,
    children: [
      { path: "", component: BooksListComponent },
      { path: "new", component: BooksFormComponent },
      { path: ":id/edit", component: BooksFormComponent },
    ],
  },
];
