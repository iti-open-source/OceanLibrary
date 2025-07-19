import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  LucideAngularModule,
  Plus,
  Search,
  User,
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
import { AuthorsService } from "../../../../services/authors.service";
import { Author, AuthorsResponse } from "../../../../types/author.interface";
import { ErrorModalComponent } from "../../../../components/error-modal/error-modal.component";
import { SortBy } from "../../../../types/queryEnums";

@Component({
  selector: "app-authors-list",
  imports: [CommonModule, LucideAngularModule, ErrorModalComponent],
  templateUrl: "./authors-list.component.html",
  styleUrl: "./authors-list.component.css",
})
export class AuthorsListComponent implements OnInit, OnDestroy {
  authors: Author[] = [];
  loading = true;
  error = "";
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  searchTerm = "";
  searchCategory: "name" | "nationality" | "genres" = "name";
  sortBy: SortBy = SortBy.NAME;
  sortOrder: "asc" | "desc" = "asc";
  showDeleteModal = false;
  authorToDelete: Author | null = null;
  showSortDropdown = false;
  showSearchCategoryDropdown = false;

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
  readonly User = User;
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

  constructor(private authorsService: AuthorsService, private router: Router) {}

  ngOnInit() {
    this.setupSearchDebouncing();
    this.loadAuthors();
    this.setupClickOutsideHandler();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebouncing(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage = 1;
        this.loadAuthors(1);
      });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }

  loadAuthors(page = this.currentPage): void {
    this.loading = true;
    this.error = "";

    const options: any = {
      page: page,
      limit: 12,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    };

    // Add search term based on selected category
    if (this.searchTerm) {
      if (this.searchCategory === "name") {
        options.name = this.searchTerm;
      } else if (this.searchCategory === "nationality") {
        options.nationality = this.searchTerm;
      } else if (this.searchCategory === "genres") {
        options.genres = [this.searchTerm];
      }
    }

    this.authorsService.getAllAuthors(options).subscribe({
      next: (response: AuthorsResponse) => {
        if (response.status === "Success" && response.data) {
          this.authors = response.data.authors;
          // Use the page parameter instead of relying on API response
          this.currentPage = page;
          this.totalPages = response.data.totalPages;
          this.totalItems = response.data.totalItems;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading authors:", error);
        this.error = error.error?.message || "Failed to load authors";
        this.loading = false;
        this.showError("Load Error", this.error);
      },
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // Update currentPage immediately
      this.loadAuthors(page);
    }
  }

  editAuthor(id: string): void {
    this.router.navigate(["/admin/authors", id, "edit"]);
  }

  confirmDeleteAuthor(author: Author): void {
    this.authorToDelete = author;
    this.showDeleteModal = true;
  }

  deleteAuthor(): void {
    if (this.authorToDelete) {
      this.authorsService.deleteAuthorById(this.authorToDelete._id).subscribe({
        next: () => {
          // If we're on the last page and delete the last item, go to previous page
          if (this.authors.length === 1 && this.currentPage > 1) {
            this.loadAuthors(this.currentPage - 1);
          } else {
            this.loadAuthors(this.currentPage);
          }
          this.authorToDelete = null;
          this.showDeleteModal = false;
        },
        error: (error) => {
          console.error("Error deleting author:", error);
          this.showError(
            "Delete Error",
            error.error?.message || "Failed to delete author"
          );
          this.authorToDelete = null;
          this.showDeleteModal = false;
        },
      });
    }
  }

  cancelDelete(): void {
    this.authorToDelete = null;
    this.showDeleteModal = false;
  }

  createNewAuthor(): void {
    this.router.navigate(["/admin/authors/new"]);
  }

  // Search category methods
  onSearchCategoryChange(category: "name" | "nationality" | "genres"): void {
    this.searchCategory = category;
    this.showSearchCategoryDropdown = false;
    if (this.searchTerm) {
      this.currentPage = 1;
      this.loadAuthors(1);
    }
  }

  getSearchCategoryLabel(): string {
    switch (this.searchCategory) {
      case "name":
        return "Name";
      case "nationality":
        return "Nationality";
      case "genres":
        return "Genres";
      default:
        return "Name";
    }
  }

  getSearchPlaceholder(): string {
    switch (this.searchCategory) {
      case "name":
        return "Search authors by name...";
      case "nationality":
        return "Search authors by nationality...";
      case "genres":
        return "Search authors by genre...";
      default:
        return "Search authors...";
    }
  }

  // Sorting methods
  setSortBy(sortBy: SortBy): void {
    if (this.sortBy === sortBy) {
      // Toggle sort order if same field
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    } else {
      // Set new sort field with ascending order
      this.sortBy = sortBy;
      this.sortOrder = "asc";
    }
    this.showSortDropdown = false;
    this.currentPage = 1;
    this.loadAuthors(1);
  }

  getSortLabel(): string {
    const orderText = this.sortOrder === "asc" ? "↑" : "↓";
    switch (this.sortBy) {
      case SortBy.NAME:
        return `Name ${orderText}`;
      case SortBy.NATIONALITY:
        return `Nationality ${orderText}`;
      case SortBy.CREATED_AT:
        return `Date Created ${orderText}`;
      default:
        return `Name ${orderText}`;
    }
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

  private showError(title: string, message: string, showAction = false): void {
    this.errorModalTitle = title;
    this.errorModalMessage = message;
    this.errorModalShowAction = showAction;
    this.showErrorModal = true;
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      console.log("Image failed to load:", target.src);
      target.src =
        "https://images.assetsdelivery.com/compings_v2/apoev/apoev1811/apoev181100196.jpg";
    }
  }

  onErrorModalAction(): void {
    this.showErrorModal = false;
    this.loadAuthors();
  }

  onErrorModalClose(): void {
    this.showErrorModal = false;
  }

  private setupClickOutsideHandler(): void {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // Close search category dropdown if clicking outside
      if (!target.closest(".search-category-dropdown")) {
        this.showSearchCategoryDropdown = false;
      }

      // Close sort dropdown if clicking outside
      if (!target.closest(".sort-dropdown")) {
        this.showSortDropdown = false;
      }
    });
  }
}
