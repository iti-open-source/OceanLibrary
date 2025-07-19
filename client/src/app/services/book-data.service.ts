import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Book } from "../types/book.interface";

@Injectable({
  providedIn: "root",
})
export class BookDataService {
  private currentBookSubject = new BehaviorSubject<Book | null>(null);
  public currentBook$: Observable<Book | null> =
    this.currentBookSubject.asObservable();

  setCurrentBook(book: Book | null): void {
    this.currentBookSubject.next(book);
  }

  getCurrentBook(): Book | null {
    return this.currentBookSubject.value;
  }
}
