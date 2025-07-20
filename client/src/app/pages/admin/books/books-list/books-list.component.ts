import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  LucideAngularModule,
  Plus,
  Search,
  Book,
  File,
  BookOpen,
  Edit,
  Trash2,
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
} from "lucide-angular";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { BooksService } from "../../../../services/books.service";
import {
  Book as BookInterface,
  BooksResponse,
} from "../../../../types/book.interface";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { BookCardComponent } from "../../../../components/book-card/book-card.component";
import {
  AutocompleteSearchComponent,
  AutocompleteOption,
} from "../../../../components/autocomplete-search/autocomplete-search.component";
import { Fields, SortBy } from "../../../../types/queryEnums";

@Component({
  selector: "app-books-list",
  imports: [
    CommonModule,
    LucideAngularModule,
    ErrorModalComponent,
    BookCardComponent,
    AutocompleteSearchComponent,
  ],
  templateUrl: "./books-list.component.html",
  styleUrl: "./books-list.component.css",
})
export class BooksListComponent implements OnInit, OnDestroy {
  books: BookInterface[] = [];
  loading = true;
  error = "";
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  searchTerm = "";
  sortBy: SortBy = SortBy.TITLE;
  sortOrder: "asc" | "desc" = "asc";
  showDeleteModal = false;
  bookToDelete: BookInterface | null = null;
  showSortDropdown = false;

  // Error modal properties
  showErrorModal = false;
  errorModalTitle = "Error";
  errorModalMessage = "";
  errorModalShowAction = false;
  errorModalActionText = "Try Again";

  // Search debouncing
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Register Lucide icons
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Book = Book;
  readonly File = File;
  readonly BookOpen = BookOpen;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly AlertCircle = AlertCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ChevronDown = ChevronDown;
  readonly ArrowUpDown = ArrowUpDown;

  // Enums for template
  readonly SortBy = SortBy;

  constructor(private booksService: BooksService, private router: Router) {}

  ngOnInit() {
    this.setupSearchDebouncing();
    this.setupClickOutsideHandler();
    this.loadBooks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener("click", this.closeDropdownsOnClickOutside);
  }

  private setupSearchDebouncing() {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadBooks(1);
      });
  }

  loadBooks(page = 1) {
    this.loading = true;
    this.error = "";
    this.showErrorModal = false;

    // Construct sortBy string with '-' prefix for descending order
    const sortByString =
      this.sortOrder === "desc" ? `-${this.sortBy}` : this.sortBy;

    const options: any = {
      page,
      limit: 12,
      sortBy: sortByString,
      fields: [
        Fields.STOCK,
        Fields.TITLE,
        Fields.AUTHOR_NAME,
        Fields.RATING_AVERAGE,
        Fields.RATING_QUANTITY,
        Fields.GENRES,
        Fields.PRICE,
        Fields.IMAGE,
      ],
    };

    // Add elastic search parameter
    if (this.searchTerm) {
      options.search = this.searchTerm;
    }

    this.booksService.getAllBooks(options).subscribe({
      next: (response: BooksResponse) => {
        this.books = response.data.books;
        // Use the page parameter instead of relying on API response
        this.currentPage = page;
        this.totalPages = response.data.totalPages;
        this.totalItems = response.data.totalItems;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showError(
          "Failed to Load Books",
          "Unable to load books. Please check your connection and try again.",
          true,
          () => this.loadBooks(this.currentPage)
        );
      },
    });
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadBooks(1);
  }

  onSuggestionSelected(suggestion: AutocompleteOption) {
    // Since autocomplete now only returns books, handle it accordingly
    this.searchTerm = suggestion.title;
    this.currentPage = 1;
    this.loadBooks(1);
  }

  onSortChange(sortBy: SortBy, order: "asc" | "desc" = "asc") {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this.showSortDropdown = false;
    this.currentPage = 1;
    this.loadBooks(1);
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  getSortLabel(): string {
    const sortLabel =
      this.sortBy === SortBy.STOCK
        ? "Stock"
        : this.sortBy === SortBy.PRICE
        ? "Price"
        : this.sortBy === SortBy.TITLE
        ? "Title"
        : this.sortBy === SortBy.AVERAGE_RATING
        ? "Rating"
        : this.sortBy === SortBy.RATING_QUANTITY
        ? "Reviews"
        : "Title";

    const orderLabel = this.sortOrder === "desc" ? "↓" : "↑";
    return `${sortLabel} ${orderLabel}`;
  }

  // Pagination helper method
  getPaginationArray(): number[] {
    const maxPagesToShow = 5;
    const pages: number[] = [];

    if (this.totalPages <= maxPagesToShow) {
      // Show all pages if total is less than or equal to maxPagesToShow
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end pages to show
      let startPage = Math.max(
        1,
        this.currentPage - Math.floor(maxPagesToShow / 2)
      );
      let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // Add ellipsis and first page if needed
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push(-1); // -1 represents ellipsis
        }
      }

      // Add the visible page range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          pages.push(-1); // -1 represents ellipsis
        }
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // Update currentPage immediately
      this.loadBooks(page);
    }
  }

  openDeleteModal(book: BookInterface) {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  confirmDelete() {
    if (this.bookToDelete) {
      this.booksService.deleteBookById(this.bookToDelete._id).subscribe({
        next: () => {
          // If we're on the last page and delete the last item, go to previous page
          if (this.books.length === 1 && this.currentPage > 1) {
            this.loadBooks(this.currentPage - 1);
          } else {
            this.loadBooks(this.currentPage);
          }
          this.closeDeleteModal();
        },
        error: (error) => {
          this.closeDeleteModal();
          this.showError(
            "Failed to Delete Book",
            "Unable to delete the book. Please try again.",
            true,
            () => this.confirmDelete()
          );
        },
      });
    }
  }

  // Error modal methods
  private showError(
    title: string,
    message: string,
    showAction = false,
    actionCallback?: () => void
  ) {
    this.errorModalTitle = title;
    this.errorModalMessage = message;
    this.errorModalShowAction = showAction;
    this.showErrorModal = true;

    if (actionCallback) {
      this.errorActionCallback = actionCallback;
    }
  }

  onErrorModalClose() {
    this.showErrorModal = false;
  }

  onErrorModalAction() {
    this.showErrorModal = false;
    if (this.errorActionCallback) {
      this.errorActionCallback();
    }
  }

  private errorActionCallback?: () => void;

  // Book card event handlers
  onBookEdit(bookId: string) {
    this.navigateToEditBook(bookId);
  }

  onBookDelete(book: BookInterface) {
    this.openDeleteModal(book);
  }

  navigateToAddBook() {
    this.router.navigate(["/admin/books/new"]);
  }

  navigateToEditBook(bookId: string) {
    this.router.navigate([`/admin/books/${bookId}/edit`]);
  }

  private setupClickOutsideHandler() {
    document.addEventListener("click", this.closeDropdownsOnClickOutside);
  }

  private closeDropdownsOnClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".sort-dropdown")) {
      this.showSortDropdown = false;
    }
  };
}
