import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ModeSwitcherComponent } from "./components/mode-switcher/mode-switcher.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ModeSwitcherComponent, FooterComponent, NavbarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "ocean library";
}
