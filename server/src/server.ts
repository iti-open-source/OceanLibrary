import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

const { PORT, DB_URI } = process.env;

if (!DB_URI) {
  throw new Error("Missing DB_URI");
}

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost/${PORT}`);
    });
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Connection to database failed", error);
    process.exit(1);
  });
