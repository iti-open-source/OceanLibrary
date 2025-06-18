import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 3000;
const db = process.env.DB_URI;

if (!db) {
  throw new Error("Missing DB_URI");
}

mongoose
  .connect(db)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost/${port}`);
    });
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Connection to database failed", error);
    process.exit(1);
  });
