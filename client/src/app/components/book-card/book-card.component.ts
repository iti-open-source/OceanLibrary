import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, Edit, Trash2 } from "lucide-angular";
import { Book } from "../../types/book.interface";

@Component({
  selector: "app-book-card",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./book-card.component.html",
  styleUrl: "./book-card.component.css",
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Book>();

  readonly Edit = Edit;
  readonly Trash2 = Trash2;

  onEdit() {
    this.edit.emit(this.book._id);
  }

  onDelete() {
    this.delete.emit(this.book);
  }

  getStarArray(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < Math.floor(rating));
  }
}
