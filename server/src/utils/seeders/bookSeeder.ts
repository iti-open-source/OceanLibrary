import Book from "../../models/bookModel.js";
import Author from "../../models/authorModel.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { IBook } from "../../types/entities/book.js";

const { DB_URI } = process.env;

if (!DB_URI) {
  throw new Error("missing URI");
}

mongoose.connect(DB_URI);

const genresPool = [
  "fiction",
  "non-fiction",
  "fantasy",
  "science",
  "history",
  "romance",
  "mystery",
  "biography",
  "self-help",
  "horror",
  "children",
  "thriller",
  "business",
  "philosophy",
  "comics",
];

function getRandomGenres(): string[] {
  const shuffled = [...genresPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1); // 1 to 3 genres
}

function generateBook(
  authorId: mongoose.Types.ObjectId,
  authorName: string
): IBook {
  return {
    title: faker.book.title(),
    authorName: authorName,
    authorID: authorId,
    genres: getRandomGenres(),
    price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
    ratingAverage: Math.round(Math.random() * 5 * 10) / 10, // 0.0 to 5.0
    ratingQuantity: faker.number.int({ min: 0, max: 5000 }),
    description: faker.lorem.paragraphs(1),
    stock: faker.number.int({ min: 0, max: 100 }),
    image: faker.image
      .urlPicsumPhotos({ width: 300, height: 400 })
      .replace(/blur=[0-9]{1}/g, "blur=2"),
  };
}

const populateDatabase = async (): Promise<void> => {
  try {
    // First, get all authors from the database
    const authors = await Author.find({}, "_id name");

    if (authors.length === 0) {
      console.log("No authors found! Please run authorSeeder first.");
      return;
    }

    console.log(`Found ${authors.length} authors. Generating books...`);

    // Generate books with random author assignments
    const length = 500;
    const uniqueTitles: string[] = [];
    const books: IBook[] = [];

    for (let i = 0; i < length; i++) {
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const book = generateBook(randomAuthor._id, randomAuthor.name);

      if (!uniqueTitles.includes(book.title)) {
        uniqueTitles.push(book.title);
        books.push(book);
      }
    }

    await Book.insertMany(books);
    console.log(`${books.length} books have been populated!`);
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

populateDatabase();
