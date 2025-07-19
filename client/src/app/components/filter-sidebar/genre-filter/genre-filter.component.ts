import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, Search } from "lucide-angular";

@Component({
  selector: "app-genre-filter",
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: "./genre-filter.component.html",
  styleUrl: "./genre-filter.component.css",
})
export class GenreFilterComponent implements OnInit, OnChanges {
  @Input() availableGenres: string[] = [
    "fiction",
    "non-fiction",
    "mystery",
    "romance",
    "science-fiction",
    "fantasy",
    "biography",
    "history",
    "science",
    "self-help",
    "business",
    "technology",
    "health",
    "cooking",
    "travel",
  ];
  @Input() selectedGenres: string[] = [];
  @Output() genresChange = new EventEmitter<string[]>();

  filteredGenres: string[] = [];

  // Lucide Icons
  readonly Search = Search;

  ngOnInit() {
    this.filteredGenres = [...this.availableGenres];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["selectedGenres"]) {
      // React to external changes but don't emit
    }
  }

  onGenreToggle(genre: string) {
    const index = this.selectedGenres.indexOf(genre);
    if (index > -1) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genre);
    }
    this.genresChange.emit([...this.selectedGenres]);
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres.includes(genre);
  }

  clearAllGenres() {
    this.selectedGenres = [];
    this.genresChange.emit([]);
  }

  capitalizeGenre(genre: string): string {
    return genre
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  filterGenres(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredGenres = [...this.availableGenres];
    } else {
      this.filteredGenres = this.availableGenres.filter((genre) =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
}
