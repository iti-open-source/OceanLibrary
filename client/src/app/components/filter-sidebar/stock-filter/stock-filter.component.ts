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

@Component({
  selector: "app-stock-filter",
  imports: [CommonModule, FormsModule],
  templateUrl: "./stock-filter.component.html",
  styleUrl: "./stock-filter.component.css",
})
export class StockFilterComponent implements OnInit, OnChanges {
  @Input() inStockOnly = false;
  @Output() stockFilterChange = new EventEmitter<boolean>();

  showInStockOnly = false;

  ngOnInit() {
    this.showInStockOnly = this.inStockOnly;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["inStockOnly"]) {
      this.showInStockOnly = this.inStockOnly;
    }
  }

  onStockFilterChange() {
    this.stockFilterChange.emit(this.showInStockOnly);
  }

  clearStockFilter() {
    this.showInStockOnly = false;
    this.stockFilterChange.emit(false);
  }
}
