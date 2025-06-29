import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import bookModel from "../models/bookModel.js";

const { DB_URI } = process.env;

if (!DB_URI) {
  throw new Error("missing URI");
}

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Connection to database failed", error);
  });

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

function getRandomGenres() {
  const shuffled = [...genresPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 1); // 1 to 3 genres
}

function generateBook() {
  return {
    title: faker.book.title(),
    author: faker.book.author(),
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

// Generate N books
const length = 500;
const uniqueTitles: string[] = [];
const books = Array.from({ length }, () => generateBook()).filter((book) => {
  if (!uniqueTitles.includes(book.title)) {
    uniqueTitles.push(book.title);
    return true;
  }
  return false;
});

const populateDatabase = async () => {
  try {
    await bookModel.insertMany(books);
    console.log("Books collection has been populated!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

populateDatabase();
