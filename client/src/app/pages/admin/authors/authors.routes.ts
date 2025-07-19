import { Routes } from "@angular/router";
import { AuthorsPageComponent } from "./authors-page/authors-page.component";
import { AuthorsListComponent } from "./authors-list/authors-list.component";
import { AuthorsFormComponent } from "./authors-form/authors-form.component";

export const authorsRoutes: Routes = [
  {
    path: "",
    component: AuthorsPageComponent,
    children: [
      { path: "", title: "Admin | Authors", component: AuthorsListComponent },
      {
        path: "new",
        title: "Admin | New Author",
        component: AuthorsFormComponent,
      },
      {
        path: ":id/edit",
        title: "Admin | Edit Author",
        component: AuthorsFormComponent,
      },
    ],
  },
];
