import { NgClass, NgFor } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-details",
  imports: [NgClass, NgFor],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.css",
})
export class DetailsComponent {
  moreEditions = [
    {
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
      title: "Kindle Edition",
      year: "2019",
    },
    {
      cover: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
      title: "Paperback",
      year: "2004",
    },
    {
      cover: "https://covers.openlibrary.org/b/id/8231845-L.jpg",
      title: "Hardcover",
      year: "2002",
    },
    {
      cover: "https://covers.openlibrary.org/b/id/8235091-L.jpg",
      title: "Deluxe Edition",
      year: "2021",
    },
    {
      cover: "https://covers.openlibrary.org/b/id/8235113-L.jpg",
      title: "Boxed Set",
      year: "2022",
    },
  ];

  similarBooks = [
    {
      cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
      title: "The Martian",
      author: "Andy Weir",
      rating: 4,
    },
    {
      cover: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
      title: "Harry Potter",
      author: "J.K. Rowling",
      rating: 5,
    },
    {
      cover: "https://covers.openlibrary.org/b/id/8235091-L.jpg",
      title: "The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
      rating: 5,
    },
    {
      cover: "https://covers.openlibrary.org/b/id/8101341-L.jpg",
      title: "Dune",
      author: "Frank Herbert",
      rating: 4,
    },
    {
      cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      rating: 4,
    },
  ];
}
