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

export interface PagesRange {
  min: number;
  max: number;
}

@Component({
  selector: "app-pages-range-filter",
  imports: [CommonModule, FormsModule],
  templateUrl: "./pages-range-filter.component.html",
  styleUrl: "./pages-range-filter.component.css",
})
export class PagesRangeFilterComponent implements OnInit, OnChanges {
  @Input() initialPagesRange: PagesRange = { min: 0, max: 1000 };
  @Output() pagesRangeChange = new EventEmitter<PagesRange>();

  minPages = 0;
  maxPages = 1000;
  currentMinPages = 0;
  currentMaxPages = 1000;

  ngOnInit() {
    this.initializePagesRange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["initialPagesRange"]) {
      this.initializePagesRange();
    }
  }

  private initializePagesRange() {
    this.currentMinPages = this.initialPagesRange.min;
    this.currentMaxPages = this.initialPagesRange.max;
  }

  onMinPagesChange() {
    if (this.currentMinPages > this.currentMaxPages) {
      this.currentMinPages = this.currentMaxPages;
    }
    this.emitPagesRange();
  }

  onMaxPagesChange() {
    if (this.currentMaxPages < this.currentMinPages) {
      this.currentMaxPages = this.currentMinPages;
    }
    this.emitPagesRange();
  }

  private emitPagesRange() {
    this.pagesRangeChange.emit({
      min: this.currentMinPages,
      max: this.currentMaxPages,
    });
  }

  resetPagesRange() {
    this.currentMinPages = this.minPages;
    this.currentMaxPages = this.maxPages;
    this.emitPagesRange();
  }
}
