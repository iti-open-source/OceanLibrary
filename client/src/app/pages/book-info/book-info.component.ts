import { Component } from "@angular/core";
import { BookHeroComponent } from "../../components/book-hero/book-hero.component";
import { RouterModule } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";

@Component({
  selector: "app-book-info",
  imports: [BookHeroComponent, RouterModule, LucideAngularModule],
  templateUrl: "./book-info.component.html",
  styleUrl: "./book-info.component.css",
})
export class BookInfoComponent {}
