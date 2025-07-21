import { Component, OnInit } from "@angular/core";
import { BooksService } from "../../services/books.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  LucideAngularModule,
  BookOpen,
  Star,
  TrendingUp,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  ArrowRight,
  Users,
  Award,
  Clock,
  DollarSign,
  Crown,
} from "lucide-angular";

interface Book {
  _id: string;
  title: string;
  authorName: string;
  description: string;
  price: number;
  image: string;
  genres: string[];
  ratingAverage: number;
  ratingQuantity: number;
  pages: number;
  stock: number;
  createdAt?: string;
}

@Component({
  selector: "app-home",
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  // Data properties
  featuredBooks: Book[] = [];
  topRatedBooks: Book[] = [];
  recentBooks: Book[] = [];
  genreBooks: { [key: string]: Book[] } = {};

  // Loading states
  isLoading = true;
  errorMessage = "";

  // Featured genres to highlight
  featuredGenres = [
    "Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Thriller",
  ];

  // Icons
  readonly BookOpen = BookOpen;
  readonly Star = Star;
  readonly TrendingUp = TrendingUp;
  readonly Heart = Heart;
  readonly ShoppingCart = ShoppingCart;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly ArrowRight = ArrowRight;
  readonly Users = Users;
  readonly Award = Award;
  readonly Clock = Clock;
  readonly DollarSign = DollarSign;
  readonly Crown = Crown;

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.isLoading = true;
    this.errorMessage = "";

    // Load all books and organize them
    this.booksService.getAllBooks({ limit: 50 }).subscribe({
      next: (response) => {
        let allBooks: Book[] = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          allBooks = response;
        } else if (
          response?.data?.books &&
          Array.isArray(response.data.books)
        ) {
          allBooks = response.data.books;
        } else if (response?.books && Array.isArray(response.books)) {
          allBooks = response.books;
        } else {
          console.error("Unexpected API response format:", response);
          this.errorMessage = "Unable to load books data.";
          this.isLoading = false;
          return;
        }

        this.organizeBooks(allBooks);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading books:", error);
        this.errorMessage = "Failed to load books. Please try again later.";
        this.isLoading = false;
      },
    });
  }

  private organizeBooks(books: Book[]): void {
    // Featured books - highest rated books with good ratings count
    this.featuredBooks = books
      .filter((book) => book.ratingQuantity >= 10 && book.ratingAverage >= 4.0)
      .sort((a, b) => b.ratingAverage - a.ratingAverage)
      .slice(0, 3);

    // If not enough highly rated books, fill with any highly rated books
    if (this.featuredBooks.length < 3) {
      const additional = books
        .filter((book) => book.ratingAverage >= 3.5)
        .sort((a, b) => b.ratingAverage - a.ratingAverage)
        .slice(0, 3 - this.featuredBooks.length);
      this.featuredBooks = [...this.featuredBooks, ...additional];
    }

    // Top rated books - all books sorted by rating
    this.topRatedBooks = books
      .filter((book) => book.ratingQuantity > 0)
      .sort((a, b) => {
        // Sort by rating average first, then by rating quantity
        if (b.ratingAverage === a.ratingAverage) {
          return b.ratingQuantity - a.ratingQuantity;
        }
        return b.ratingAverage - a.ratingAverage;
      })
      .slice(0, 8);

    // Recent books - newest books (if createdAt is available, otherwise just use first books)
    this.recentBooks = books
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0; // Keep original order if no dates
      })
      .slice(0, 6);

    // Organize books by genre
    this.genreBooks = {};
    this.featuredGenres.forEach((genre) => {
      const booksInGenre = books
        .filter((book) =>
          book.genres.some(
            (g) =>
              g.toLowerCase().includes(genre.toLowerCase()) ||
              genre.toLowerCase().includes(g.toLowerCase())
          )
        )
        .slice(0, 5);

      if (booksInGenre.length > 0) {
        this.genreBooks[genre] = booksInGenre;
      }
    });
  }

  getStarArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  getGenreKeys(): string[] {
    return Object.keys(this.genreBooks);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }

  getReadingTime(pages: number): string {
    const avgWordsPerPage = 250;
    const avgReadingSpeed = 200; // words per minute
    const totalMinutes = (pages * avgWordsPerPage) / avgReadingSpeed;
    const hours = Math.floor(totalMinutes / 60);
    return `~${hours}h read`;
  }

  truncateDescription(description: string, maxLength: number = 150): string {
    if (description.length <= maxLength) return description;
    return description.substr(0, maxLength).trim() + "...";
  }
}
