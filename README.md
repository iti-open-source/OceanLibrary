# OceanLibrary Bookstore

A full-stack e-commerce web application for books, featuring a modern Angular frontend and a robust Node.js/Express backend with MongoDB.

---

## Features

- 📚 Browse, search, and view book details
- 🛒 Shopping cart and order management
- 📝 User authentication and registration
- ⭐ Book reviews and ratings
- 🧑‍💼 Admin dashboard for managing books, users, and orders
- 📱 Responsive, mobile-first UI
- 🌗 Light/Dark mode support

---

## Tech Stack

### Frontend

- **Angular 19+**
- **Tailwind CSS** for utility-first styling
- **Lucide Icons** and FontAwesome
- **RxJS** for reactive programming

### Backend

- **Node.js** with **Express**
- **MongoDB** with **Mongoose**
- **JWT** authentication
- **Zod** for validation
- **Winston** for logging
- **Multer** for file uploads

---

## Project Structure

```
prototype_2/
  client/   # Angular frontend
    src/app/
      components/   # UI components (navbar, sidebar, etc.)
      pages/        # Page modules (home, book-info, cart, admin, etc.)
      services/     # API and state management
      types/        # TypeScript interfaces
  server/   # Node.js backend
    src/
      controllers/  # Route logic
      models/       # Mongoose schemas
      routes/       # API endpoints
      middlewares/  # Auth, error handling, etc.
      utils/        # Helpers, email, validation, etc.
    uploads/        # Uploaded book images
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/e-commerce-itians/prototype_2.git
   cd prototype_2
   ```

2. **Install dependencies:**

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` in the `server/` directory and set your MongoDB URI and other secrets.

4. **Run the backend:**

   ```bash
   cd server
   npm run dev
   ```

5. **Run the frontend:**

   ```bash
   cd client
   npm start
   ```

6. **Visit:**
   - Frontend: [http://localhost:4200](http://localhost:4200)
   - Backend API: [https://bookstore.adel.dev/server/api/v1](https://bookstore.adel.dev/server/api/v1)

---

## Scripts

### Frontend

- `npm start` — Run Angular dev server
- `npm run build` — Build for production
- `npm test` — Run unit tests

### Backend

- `npm run dev` — Start server with auto-reload
- `npm start` — Start server (production)

---

## API Documentation

### Base URL

```
https://bookstore.adel.dev/server/api/v1
```

### Endpoints

#### Auth

- `POST   /users/register` — Register a new user
- `POST   /users/login` — Login and receive JWT
- `GET    /users/profile` — Get current user profile (auth required)

#### Books

- `GET    /books` — List all books (with filters, search, pagination)
- `GET    /books/:id` — Get book details
- `POST   /books` — Add a new book (admin only)
- `PUT    /books/:id` — Update book (admin only)
- `DELETE /books/:id` — Delete book (admin only)

#### Authors

- `GET    /authors` — List all authors
- `GET    /authors/:id` — Get author details

#### Cart

- `GET    /cart` — Get current user's cart
- `POST   /cart` — Add book to cart
- `PUT    /cart/:bookId` — Update quantity
- `DELETE /cart/:bookId` — Remove book from cart

#### Orders

- `GET    /orders` — List user orders
- `POST   /orders` — Place a new order

#### Reviews

- `GET    /reviews/book/:bookId` — Get reviews for a book
- `POST   /reviews/book/:bookId` — Add a review (auth required)

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the ISC License.

---

## Authors

- ITI E-Commerce Team

---
