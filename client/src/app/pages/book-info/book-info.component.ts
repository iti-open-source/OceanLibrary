import { Component } from '@angular/core';
import { BookHeroComponent } from '../../components/book-hero/book-hero.component';

@Component({
  selector: 'app-book-info',
  imports: [BookHeroComponent],
  templateUrl: './book-info.component.html',
  styleUrl: './book-info.component.css'
})
export class BookInfoComponent {

}
