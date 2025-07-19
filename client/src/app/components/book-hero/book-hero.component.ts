import { Component, Input } from "@angular/core";
import { Book } from "../../types/book.interface";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-book-hero",
  imports: [CommonModule],
  templateUrl: "./book-hero.component.html",
  styleUrl: "./book-hero.component.css",
})
export class BookHeroComponent {
  @Input() book: Book | null = null;
}
