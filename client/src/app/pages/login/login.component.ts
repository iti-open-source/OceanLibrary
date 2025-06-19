import { Component, OnInit, Renderer2 } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ModeSwitcherComponent } from "../../components/mode-switcher/mode-switcher.component";

@Component({
  imports: [RouterLink, ModeSwitcherComponent],
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  isDarkMode = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains("dark-mode");
    this.setBodyClass(this.isDarkMode);
  }

  toggleDarkMode(event: Event) {
    this.isDarkMode = (event.target as HTMLInputElement).checked;
    this.setBodyClass(this.isDarkMode);
  }

  setBodyClass(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.body, "dark-mode");
    } else {
      this.renderer.removeClass(document.body, "dark-mode");
    }
  }
}
