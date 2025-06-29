export interface IBook {
  title: string;
  author: string;
  genres: string[];
  price: number;
  description: string;
  stock: number;
  ratingAverage?: number;
  ratingQuantity?: number;
  image: string;
}
