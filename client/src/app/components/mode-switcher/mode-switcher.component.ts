import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-mode-switcher",
  imports: [CommonModule],
  templateUrl: "./mode-switcher.component.html",
  styleUrl: "./mode-switcher.component.css",
})
export class ModeSwitcherComponent {
  isDarkMode = false;

  constructor() {
    this.isDarkMode = document.body.classList.contains("dark-mode");
  }

  toggleDarkMode(event: Event) {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }
}
