import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, Search, X } from "lucide-angular";

@Component({
  selector: "app-search-bar",
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: "./search-bar.component.html",
  styleUrl: "./search-bar.component.css",
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();

  searchQuery = "";
  isFocused = false;
  isSearching = false;

  readonly Search = Search;
  readonly X = X;

  onSearchChange() {
    this.isSearching = true;

    // Simulate search delay for better UX
    setTimeout(() => {
      this.isSearching = false;
      this.searchChange.emit(this.searchQuery);
    }, 300);
  }

  onSearchClear() {
    this.searchQuery = "";
    this.isSearching = false;
    this.searchChange.emit("");
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    // Add small delay to allow click events on suggestions
    setTimeout(() => {
      this.isFocused = false;
    }, 150);
  }
}
