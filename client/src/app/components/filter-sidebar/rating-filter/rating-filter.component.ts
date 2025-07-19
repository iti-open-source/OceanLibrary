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
import { LucideAngularModule, Star } from "lucide-angular";

@Component({
  selector: "app-rating-filter",
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: "./rating-filter.component.html",
  styleUrl: "./rating-filter.component.css",
})
export class RatingFilterComponent implements OnInit, OnChanges {
  @Input() selectedRating = 0;
  @Output() ratingChange = new EventEmitter<number>();

  readonly Star = Star;

  ratingOptions = [
    { value: 0, label: "All Ratings", stars: 0 },
    { value: 4, label: "4+ Stars", stars: 4 },
    { value: 3, label: "3+ Stars", stars: 3 },
    { value: 2, label: "2+ Stars", stars: 2 },
    { value: 1, label: "1+ Stars", stars: 1 },
  ];

  ngOnInit() {
    // No automatic emission
  }

  ngOnChanges(changes: SimpleChanges) {
    // React to external changes but don't emit
  }

  onRatingChange() {
    this.ratingChange.emit(this.selectedRating);
  }

  getStarArray(count: number): number[] {
    return Array(count)
      .fill(0)
      .map((_, i) => i);
  }

  clearRating() {
    this.selectedRating = 0;
    this.ratingChange.emit(0);
  }
}
