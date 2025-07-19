import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  LucideAngularModule,
  Filter,
  LayoutGrid,
  Search as SearchIcon,
} from "lucide-angular";
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs";

import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import {
  FilterSidebarComponent,
  FilterState,
} from "../../components/filter-sidebar/filter-sidebar.component";
import { BrowseBookCardComponent } from "../../components/browse-book-card/browse-book-card.component";
import { Book, BooksResponse } from "../../types/book.interface";
import { BooksService } from "../../services/books.service";
import { CartService } from "../../services/cart.service";
import { Router } from "@angular/router";

interface QuickFilterTag {
  label: string;
  value: string;
  searchQuery?: string;
  filters?: Partial<FilterState>;
}

@Component({
  selector: "app-browse",
  imports: [
    CommonModule,
    LucideAngularModule,
    SearchBarComponent,
    FilterSidebarComponent,
    BrowseBookCardComponent,
  ],
  templateUrl: "./browse.component.html",
  styleUrl: "./browse.component.css",
})
export class BrowseComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Icons
  readonly Filter = Filter;
  readonly LayoutGrid = LayoutGrid;
  readonly SearchIcon = SearchIcon;

  // State
  books: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading = false;
  error: string | null = null;

  // UI State
  isSidebarOpen = false;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  // Filter and search state
  searchQuery = "";
  currentFilters: FilterState = {
    genres: [],
    priceRange: { min: 0, max: 100 },
    pagesRange: { min: 0, max: 1000 },
    minRating: 0,
    inStockOnly: false,
  };
  currentSort: string = "newest";

  // Quick filter functionality
  activeQuickFilter: string | null = null;
  quickFilterTags: QuickFilterTag[] = [
    {
      label: "🔥 Bestsellers",
      value: "bestsellers",
      searchQuery: "bestseller",
    },
    { label: "⭐ Top Rated", value: "top-rated", filters: { minRating: 4.5 } },
    {
      label: "💰 Under $20",
      value: "budget",
      filters: { priceRange: { min: 0, max: 20 } },
    },
    { label: "📚 Fiction", value: "fiction", filters: { genres: ["fiction"] } },
    { label: "🔍 Mystery", value: "mystery", filters: { genres: ["mystery"] } },
    {
      label: "🚀 Sci-Fi",
      value: "scifi",
      filters: { genres: ["science-fiction"] },
    },
    { label: "💕 Romance", value: "romance", filters: { genres: ["romance"] } },
  ];

  get activeFiltersCount(): number {
    let count = 0;
    if (this.currentFilters.genres.length > 0) count++;
    if (
      this.currentFilters.priceRange.min > 0 ||
      this.currentFilters.priceRange.max < 100
    )
      count++;
    if (
      this.currentFilters.pagesRange.min > 0 ||
      this.currentFilters.pagesRange.max < 1000
    )
      count++;
    if (this.currentFilters.minRating > 0) count++;
    if (this.currentFilters.inStockOnly) count++;
    return count;
  }

  constructor(
    private booksService: BooksService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("BrowseComponent initialized"); // Debug log
    this.loadBooks();

    // Fallback mock data for testing if API fails
    setTimeout(() => {
      if (this.books.length === 0 && !this.isLoading && !this.error) {
        console.log("Loading mock data for testing...");
        this.loadMockData();
      }
    }, 3000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooks() {
    this.isLoading = true;
    this.error = null;

    const options: any = {
      page: this.currentPage,
      limit: 12,
      ...(this.searchQuery && { search: this.searchQuery }),
      ...(this.currentFilters.genres.length > 0 && {
        genres: this.currentFilters.genres,
      }),
      ...(this.currentFilters.priceRange.min > 0 && {
        priceMin: this.currentFilters.priceRange.min,
      }),
      ...(this.currentFilters.priceRange.max < 100 && {
        priceMax: this.currentFilters.priceRange.max,
      }),
      sortBy: this.getSortQuery(),
    };

    this.booksService.getAllBooks(options).subscribe({
      next: (response) => {
        console.log("Books response:", response); // Debug log
        if (response && response.status === "success" && response.data) {
          this.books = response.data.books || [];
          this.totalPages = response.data.totalPages || 1;
          this.totalItems = response.data.totalItems || 0;
          this.applyClientSideFilters();
        } else {
          // Fallback if response structure is different
          this.books = response.data?.books || response.books || response || [];
          this.totalPages =
            response.data?.totalPages || response.totalPages || 1;
          this.totalItems =
            response.data?.totalItems ||
            response.totalItems ||
            this.books.length;
          this.applyClientSideFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading books:", error);
        this.error = "Failed to load books. Please try again.";
        this.isLoading = false;
      },
    });
  }

  private getSortQuery(): string {
    switch (this.currentSort) {
      case "price-asc":
        return "price";
      case "price-desc":
        return "-price";
      case "rating-desc":
        return "-ratingAverage";
      case "reviews-desc":
        return "-ratingQuantity";
      case "title-asc":
        return "title";
      case "newest":
      default:
        return "-createdAt";
    }
  }

  private applyClientSideFilters() {
    let filtered = [...this.books];

    // Apply price range filter
    if (
      this.currentFilters.priceRange.min > 0 ||
      this.currentFilters.priceRange.max < 100
    ) {
      filtered = filtered.filter(
        (book) =>
          book.price >= this.currentFilters.priceRange.min &&
          book.price <= this.currentFilters.priceRange.max
      );
    }

    // Apply pages range filter
    if (
      this.currentFilters.pagesRange.min > 0 ||
      this.currentFilters.pagesRange.max < 1000
    ) {
      filtered = filtered.filter(
        (book) =>
          book.pages >= this.currentFilters.pagesRange.min &&
          book.pages <= this.currentFilters.pagesRange.max
      );
    }

    this.filteredBooks = filtered;
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadBooks();
  }

  onFiltersChange(filters: FilterState) {
    this.currentFilters = filters;
    this.currentPage = 1;
    this.loadBooks();
  }

  onSortChange(sort: string) {
    this.currentSort = sort;
    this.currentPage = 1;
    this.loadBooks();
  }

  applyQuickFilter(filterValue: string) {
    const tag = this.quickFilterTags.find((t) => t.value === filterValue);
    if (!tag) return;

    // Toggle filter if already active
    if (this.activeQuickFilter === filterValue) {
      this.activeQuickFilter = null;
      this.searchQuery = "";
      this.currentFilters = {
        genres: [],
        priceRange: { min: 0, max: 100 },
        pagesRange: { min: 0, max: 1000 },
        minRating: 0,
        inStockOnly: false,
      };
    } else {
      this.activeQuickFilter = filterValue;

      // Apply search query if specified
      if (tag.searchQuery) {
        this.searchQuery = tag.searchQuery;
      }

      // Apply filters if specified
      if (tag.filters) {
        this.currentFilters = {
          ...this.currentFilters,
          ...tag.filters,
        };
      }
    }

    this.currentPage = 1;
    this.loadBooks();
  }

  onAddToCart(book: Book) {
    this.cartService.addToCart(book._id, 1).subscribe({
      next: (response) => {
        console.log("Added to cart:", book.title);
        // You could show a toast notification here
      },
      error: (error) => {
        console.error("Error adding to cart:", error);
        // You could show an error notification here
      },
    });
  }

  onAddToWishlist(book: Book) {
    // Implement wishlist functionality
    console.log("Added to wishlist:", book.title);
  }

  onViewBookDetails(book: Book) {
    // Navigate to book details page
    this.router.navigate(["book-info/" + book._id]);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSidebarToggle(isOpen: boolean) {
    this.isSidebarOpen = isOpen;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadBooks();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  trackByBookId(index: number, book: Book): string {
    return book._id;
  }

  // Mock data for testing when API is not available
  private loadMockData() {
    const mockBooks: Book[] = [
      {
        _id: "1",
        title: "The Great Adventure",
        authorName: "John Smith",
        authorID: "author1",
        pages: 350,
        genres: ["fiction", "adventure"],
        price: 24.99,
        description: "An exciting adventure story",
        stock: 15,
        ratingAverage: 4.5,
        ratingQuantity: 120,
        image: "https://picsum.photos/seed/book1/300/400",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        _id: "2",
        title: "Mystery of the Lost Key",
        authorName: "Jane Doe",
        authorID: "author2",
        pages: 280,
        genres: ["mystery", "thriller"],
        price: 19.99,
        description: "A thrilling mystery",
        stock: 8,
        ratingAverage: 4.2,
        ratingQuantity: 85,
        image: "https://picsum.photos/seed/book2/300/400",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      },
      {
        _id: "3",
        title: "Science and the Future",
        authorName: "Dr. Alan Tech",
        authorID: "author3",
        pages: 420,
        genres: ["science", "non-fiction"],
        price: 34.99,
        description: "Exploring future technologies",
        stock: 12,
        ratingAverage: 4.8,
        ratingQuantity: 95,
        image: "https://picsum.photos/seed/book3/300/400",
        createdAt: "2024-01-03T00:00:00Z",
        updatedAt: "2024-01-03T00:00:00Z",
      },
      {
        _id: "4",
        title: "Romance in Paris",
        authorName: "Marie Love",
        authorID: "author4",
        pages: 245,
        genres: ["romance", "fiction"],
        price: 16.99,
        description: "A beautiful love story",
        stock: 20,
        ratingAverage: 4.3,
        ratingQuantity: 150,
        image: "https://picsum.photos/seed/book4/300/400",
        createdAt: "2024-01-04T00:00:00Z",
        updatedAt: "2024-01-04T00:00:00Z",
      },
    ];

    this.books = mockBooks;
    this.totalItems = mockBooks.length;
    this.totalPages = 1;
    this.applyClientSideFilters();
    console.log("Mock data loaded:", this.books);
  }
}
