import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export interface PriceRange {
  min: number;
  max: number;
}

@Component({
  selector: "app-price-range-filter",
  imports: [CommonModule, FormsModule],
  templateUrl: "./price-range-filter.component.html",
  styleUrl: "./price-range-filter.component.css",
})
export class PriceRangeFilterComponent implements OnInit, OnChanges {
  @Input() initialPriceRange: PriceRange = { min: 0, max: 100 };
  @Output() priceRangeChange = new EventEmitter<PriceRange>();

  minPrice = 0;
  maxPrice = 100;
  currentMinPrice = 0;
  currentMaxPrice = 100;

  ngOnInit() {
    this.initializePriceRange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["initialPriceRange"]) {
      this.initializePriceRange();
    }
  }

  private initializePriceRange() {
    this.currentMinPrice = this.initialPriceRange.min;
    this.currentMaxPrice = this.initialPriceRange.max;
  }

  onMinPriceChange() {
    if (this.currentMinPrice > this.currentMaxPrice) {
      this.currentMinPrice = this.currentMaxPrice;
    }
    this.emitPriceRange();
  }

  onMaxPriceChange() {
    if (this.currentMaxPrice < this.currentMinPrice) {
      this.currentMaxPrice = this.currentMinPrice;
    }
    this.emitPriceRange();
  }

  private emitPriceRange() {
    this.priceRangeChange.emit({
      min: this.currentMinPrice,
      max: this.currentMaxPrice,
    });
  }

  resetPriceRange() {
    this.currentMinPrice = this.minPrice;
    this.currentMaxPrice = this.maxPrice;
    this.emitPriceRange();
  }
}
