import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./loading-spinner.component.html",
  styleUrl: "./loading-spinner.component.css",
})
export class LoadingSpinnerComponent {
  @Input() show: boolean = false;
  @Input() overlay: boolean = true;
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() color: string = "brand-primary";

  getSizeClass(): string {
    switch (this.size) {
      case "sm":
        return "spinner-sm";
      case "lg":
        return "spinner-lg";
      default:
        return "spinner-md";
    }
  }

  getInnerSizeClass(): string {
    switch (this.size) {
      case "sm":
        return "spinner-inner-sm";
      case "lg":
        return "spinner-inner-lg";
      default:
        return "spinner-inner-md";
    }
  }
}
