import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-not-found",
  imports: [],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.css",
})
export class NotFoundComponent implements OnInit {
  displayNumber = 0;

  ngOnInit(): void {
    this.animate404();
  }

  animate404() {
    const duration = 900;
    const start = performance.now();
    const endValue = 404;
    const animate = (now: number) => {
      const elapsed = now - start;
      if (elapsed < duration) {
        this.displayNumber = Math.floor((elapsed / duration) * endValue);
        requestAnimationFrame(animate);
      } else {
        this.displayNumber = endValue;
      }
    };
    requestAnimationFrame(animate);
  }
}
