import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideAngularModule, AlertCircle, X } from "lucide-angular";

@Component({
  selector: "app-error-modal",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./error-modal.component.html",
  styleUrl: "./error-modal.component.css",
})
export class ErrorModalComponent {
  @Input() isVisible = false;
  @Input() title = "Error";
  @Input() message = "An error occurred";
  @Input() showIcon = true;
  @Input() actionButtonText = "Try Again";
  @Input() showActionButton = false;
  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();

  readonly AlertCircle = AlertCircle;
  readonly X = X;

  onClose() {
    this.close.emit();
  }

  onAction() {
    this.action.emit();
  }

  onBackdropClick() {
    this.onClose();
  }

  onModalClick(event: Event) {
    event.stopPropagation();
  }
}
