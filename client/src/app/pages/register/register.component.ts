import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ModeSwitcherComponent } from "../../components/mode-switcher/mode-switcher.component";

@Component({
  selector: "app-register",
  imports: [RouterLink, ModeSwitcherComponent],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {}
