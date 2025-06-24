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
    const theme = localStorage.getItem("theme");
    this.isDarkMode = theme === "dark";

    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }

  toggleDarkMode(event: Event) {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }
}
