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
  Filter,
} from "lucide-angular";
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from "rxjs";
import { BooksService } from "../../../../services/books.service";
import {
  Book as BookInterface,
  BooksResponse,
} from "../../../../types/book.interface";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { BookCardComponent } from "../../../../components/book-card/book-card.component";
import { SortBy } from "../../../../types/queryEnums";

@Component({
  selector: "app-books-list",
  imports: [
    CommonModule,
    LucideAngularModule,
    ErrorModalComponent,
    BookCardComponent,
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
  searchType: "title" | "author" | "genre" = "title";
  sortBy: SortBy = SortBy.TITLE;
  sortOrder: "asc" | "desc" = "asc";
  showDeleteModal = false;
  bookToDelete: BookInterface | null = null;
  showSearchDropdown = false;
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
  readonly Filter = Filter;

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
    };

    // Add search parameter based on search type
    if (this.searchTerm) {
      switch (this.searchType) {
        case "title":
          options.title = this.searchTerm;
          break;
        case "author":
          options.author = this.searchTerm;
          break;
        // case "genre":
        //   options.genre = this.searchTerm;
        //   break;
      }
    }

    this.booksService.getAllBooks(options).subscribe({
      next: (response: BooksResponse) => {
        this.books = response.data.books;
        this.currentPage = response.data.currentPage;
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

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  onSearchTypeChange(type: "title" | "author" | "genre") {
    this.searchType = type;
    this.showSearchDropdown = false;
    if (this.searchTerm) {
      this.currentPage = 1;
      this.loadBooks(1);
    }
  }

  onSortChange(sortBy: SortBy, order: "asc" | "desc" = "asc") {
    this.sortBy = sortBy;
    this.sortOrder = order;
    this.showSortDropdown = false;
    this.currentPage = 1;
    this.loadBooks(1);
  }

  toggleSearchDropdown() {
    this.showSearchDropdown = !this.showSearchDropdown;
    this.showSortDropdown = false;
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
    this.showSearchDropdown = false;
  }

  getSearchTypeLabel(): string {
    switch (this.searchType) {
      case "title":
        return "Title";
      case "author":
        return "Author";
      case "genre":
        return "Genre";
      default:
        return "Title";
    }
  }

  getSortLabel(): string {
    const sortLabel =
      this.sortBy === SortBy.PRICE
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

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
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
    if (
      !target.closest(".search-dropdown") &&
      !target.closest(".sort-dropdown")
    ) {
      this.showSearchDropdown = false;
      this.showSortDropdown = false;
    }
  };
}
