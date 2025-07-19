import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenreFilterComponent } from "./genre-filter/genre-filter.component";
import {
  PriceRangeFilterComponent,
  PriceRange,
} from "./price-range-filter/price-range-filter.component";
import {
  PagesRangeFilterComponent,
  PagesRange,
} from "./pages-range-filter/pages-range-filter.component";
import { RatingFilterComponent } from "./rating-filter/rating-filter.component";
import { StockFilterComponent } from "./stock-filter/stock-filter.component";
import { LucideAngularModule, Filter, X } from "lucide-angular";

export interface FilterState {
  genres: string[];
  priceRange: PriceRange;
  pagesRange: PagesRange;
  minRating: number;
  inStockOnly: boolean;
}

@Component({
  selector: "app-filter-sidebar",
  imports: [
    CommonModule,
    GenreFilterComponent,
    PriceRangeFilterComponent,
    PagesRangeFilterComponent,
    RatingFilterComponent,
    StockFilterComponent,
    LucideAngularModule,
  ],
  templateUrl: "./filter-sidebar.component.html",
  styleUrl: "./filter-sidebar.component.css",
})
export class FilterSidebarComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() filtersChange = new EventEmitter<FilterState>();

  readonly Filter = Filter;
  readonly X = X;

  // Applied filters (these are what actually get emitted)
  filterState: FilterState = {
    genres: [],
    priceRange: { min: 0, max: 100 },
    pagesRange: { min: 0, max: 1000 },
    minRating: 0,
    inStockOnly: false,
  };

  // Temporary filters (these change as user interacts but aren't applied yet)
  tempFilterState: FilterState = {
    genres: [],
    priceRange: { min: 0, max: 100 },
    pagesRange: { min: 0, max: 1000 },
    minRating: 0,
    inStockOnly: false,
  };

  onGenresChange(genres: string[]) {
    this.tempFilterState.genres = genres;
  }

  onPriceRangeChange(priceRange: PriceRange) {
    this.tempFilterState.priceRange = priceRange;
  }

  onPagesRangeChange(pagesRange: PagesRange) {
    this.tempFilterState.pagesRange = pagesRange;
  }

  onRatingChange(rating: number) {
    this.tempFilterState.minRating = rating;
  }

  onStockFilterChange(inStockOnly: boolean) {
    this.tempFilterState.inStockOnly = inStockOnly;
  }

  applyFilters() {
    this.filterState = { ...this.tempFilterState };
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChange.emit({ ...this.filterState });
  }

  clearAllFilters() {
    this.tempFilterState = {
      genres: [],
      priceRange: { min: 0, max: 100 },
      pagesRange: { min: 0, max: 1000 },
      minRating: 0,
      inStockOnly: false,
    };
    this.filterState = { ...this.tempFilterState };
    this.emitFilters();
  }

  closeSidebar() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  hasActiveFilters(): boolean {
    return (
      this.filterState.genres.length > 0 ||
      this.filterState.minRating > 0 ||
      this.filterState.inStockOnly ||
      this.filterState.priceRange.min > 0 ||
      this.filterState.priceRange.max < 100 ||
      this.filterState.pagesRange.min > 0 ||
      this.filterState.pagesRange.max < 1000
    );
  }

  hasPendingChanges(): boolean {
    return (
      JSON.stringify(this.filterState) !== JSON.stringify(this.tempFilterState)
    );
  }

  discardChanges() {
    this.tempFilterState = { ...this.filterState };
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.filterState.genres.length > 0) count++;
    if (this.filterState.minRating > 0) count++;
    if (this.filterState.inStockOnly) count++;
    if (
      this.filterState.priceRange.min > 0 ||
      this.filterState.priceRange.max < 100
    )
      count++;
    if (
      this.filterState.pagesRange.min > 0 ||
      this.filterState.pagesRange.max < 1000
    )
      count++;
    return count;
  }
}
