import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, Search, Book, User } from "lucide-angular";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  switchMap,
  of,
} from "rxjs";
import { BooksService } from "../../services/books.service";
import { Book as BookInterface } from "../../types/book.interface";

export interface AutocompleteOption {
  id: string;
  title: string;
  subtitle?: string;
  type: "book" | "author";
}

@Component({
  selector: "app-autocomplete-search",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./autocomplete-search.component.html",
  styleUrls: ["./autocomplete-search.component.css"],
})
export class AutocompleteSearchComponent implements OnInit, OnDestroy {
  @Input() placeholder: string =
    "Search books and authors... (min 3 characters)";
  @Output() searchSelected = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<AutocompleteOption>();

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  searchTerm = "";
  suggestions: AutocompleteOption[] = [];
  showSuggestions = false;
  isLoading = false;
  highlightedIndex = -1;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Icons
  readonly Search = Search;
  readonly Book = Book;
  readonly User = User;

  constructor(private booksService: BooksService) {}

  ngOnInit() {
    this.setupAutocomplete();
    this.setupClickOutside();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAutocomplete() {
    this.searchSubject
      .pipe(
        debounceTime(200), // Faster response
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((term) => {
          if (term.length < 3) {
            // Require 3 characters for better suggestions
            return of({ data: { books: [] } });
          }
          this.isLoading = true;
          return this.booksService.getSearchSuggestions(term);
        })
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.processSuggestions(response.data.books || []);
        },
        error: () => {
          this.isLoading = false;
          this.suggestions = [];
        },
      });
  }

  private processSuggestions(books: BookInterface[]) {
    const suggestions: AutocompleteOption[] = [];
    const seenTitles = new Set<string>();
    const seenAuthors = new Set<string>();

    // Prioritize exact matches and popular items
    books.forEach((book) => {
      // Add book titles (prioritize unique titles)
      if (!seenTitles.has(book.title.toLowerCase())) {
        suggestions.push({
          id: book._id,
          title: book.title,
          subtitle: `by ${book.authorName}`,
          type: "book",
        });
        seenTitles.add(book.title.toLowerCase());
      }

      // Add unique authors (but fewer of them)
      if (
        book.authorName &&
        !seenAuthors.has(book.authorName.toLowerCase()) &&
        seenAuthors.size < 2
      ) {
        suggestions.push({
          id: `author-${book.authorName}`,
          title: book.authorName,
          subtitle: "Author",
          type: "author",
        });
        seenAuthors.add(book.authorName.toLowerCase());
      }
    });

    // Limit and prioritize books over authors
    this.suggestions = suggestions
      .sort((a, b) => {
        if (a.type === "book" && b.type === "author") return -1;
        if (a.type === "author" && b.type === "book") return 1;
        return 0;
      })
      .slice(0, 5); // Reduced to 5 for cleaner UI
  }

  private setupClickOutside() {
    document.addEventListener("click", this.handleClickOutside.bind(this));
  }

  private handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest("app-autocomplete-search")) {
      this.showSuggestions = false;
      this.highlightedIndex = -1;
    }
  }

  onInput(event: any) {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
    this.highlightedIndex = -1;

    if (this.searchTerm.length >= 3) {
      // Match the minimum length
      this.showSuggestions = true;
    } else {
      this.showSuggestions = false;
      this.suggestions = [];
    }
  }

  onFocus() {
    if (this.searchTerm.length >= 3 && this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onBlur() {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => {
      this.showSuggestions = false;
      this.highlightedIndex = -1;
    }, 150);
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.showSuggestions || this.suggestions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          this.suggestions.length - 1
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        break;
      case "Enter":
        event.preventDefault();
        if (this.highlightedIndex >= 0) {
          this.onSelectSuggestion(this.suggestions[this.highlightedIndex]);
        } else {
          this.onSearch();
        }
        break;
      case "Escape":
        this.showSuggestions = false;
        this.highlightedIndex = -1;
        this.searchInput.nativeElement.blur();
        break;
    }
  }

  onSelectSuggestion(suggestion: AutocompleteOption) {
    this.searchTerm = suggestion.title;
    this.searchInput.nativeElement.value = suggestion.title;
    this.showSuggestions = false;
    this.highlightedIndex = -1;

    this.suggestionSelected.emit(suggestion);
    this.searchSelected.emit(suggestion.title);
  }

  onSearch() {
    this.showSuggestions = false;
    this.searchSelected.emit(this.searchTerm);
  }

  getIconForType(type: string) {
    switch (type) {
      case "book":
        return this.Book;
      case "author":
        return this.User;
      default:
        return this.Search;
    }
  }
}
