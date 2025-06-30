import Author from "../../models/authorModel.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { IAuthor } from "../../types/entities/author.js";

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

const nationalitiesPool = [
  "American",
  "British",
  "Canadian",
  "Australian",
  "French",
  "German",
  "Italian",
  "Spanish",
  "Japanese",
  "Chinese",
  "Indian",
  "Russian",
  "Brazilian",
  "Mexican",
  "South African",
  "Nigerian",
  "Egyptian",
  "Swedish",
  "Norwegian",
  "Dutch",
];

function getRandomGenres(): string[] {
  const shuffled = [...genresPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 1); // 1 to 4 genres
}

function getRandomNationality(): string {
  return nationalitiesPool[
    Math.floor(Math.random() * nationalitiesPool.length)
  ];
}

function generateAuthor(): IAuthor {
  return {
    name: faker.person.fullName(),
    bio: faker.lorem.paragraphs(2),
    nationality: getRandomNationality(),
    photo: faker.image.personPortrait(),
    genres: getRandomGenres(),
  };
}

// Generate authors
const length = 500; // Generate 500 authors
const uniqueNames: string[] = [];
const authors = Array.from({ length }, () => generateAuthor()).filter(
  (author) => {
    if (!uniqueNames.includes(author.name)) {
      uniqueNames.push(author.name);
      return true;
    }
    return false;
  }
);

const populateDatabase = async (): Promise<void> => {
  try {
    await Author.insertMany(authors);
    console.log(`${authors.length} authors have been populated!`);
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

populateDatabase();
