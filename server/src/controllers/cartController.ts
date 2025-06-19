import { Request, Response } from "express";
import cartModel from "../models/cartModel.js";
import bookModel from "../models/bookModel.js";

/**
 * View cart - Displays cart items and total amount
 * @param req
 * @param res - items[], total<number>
 */
async function viewCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = "123"; //req.user._id;

    // Get user's cart and fetch every book info from it
    const cart = await cartModel.findById(userId).populate("items.bookId");

    // User's cart is empty
    if (!cart) {
      throw res.status(200).json({ items: [] });
    }

    // Cart is not empty, Load books into cart
    const itemsList = cart.items
      .filter((item) => item.bookId)
      .map((item: any) => ({
        bookId: item.bookId._id,
        title: item.bookId.title,
        price: item.bookId.price,
        stock: item.bookId.stock,
        image: item.bookId.image,
        quantity: item.quantity,
        subtotal: item.quantity * item.bookId.price,
      }));

    // Get total amount to be paid
    const totalAmount = itemsList.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({ items: itemsList, total: totalAmount });
  } catch (error) {
    throw Error("Couldn't load your cart.");
  }
}

/**
 * Add item to cart - Used in Book page (Add to cart)
 * @param req - BookID, Quantity
 * @param res - Error or Success message
 */
async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = "123"; //req.user._id
    const { bookId, quantity } = req.body;

    // Fetch Book info
    const book = await bookModel.findById(bookId);
    // Book doesn't exists
    if (!book) {
      throw Error("The requested book doesn't exist");
    }

    // Verify the book Stock
    if (!book.stock || book.stock < quantity) {
      throw Error("There is no enough stock available");
    }

    // Get user cart
    let cart = await cartModel.findById(userId);
    // User doesn't have a cart
    if (!cart) {
      // Create a new cart with the requested book
      cart = new cartModel({
        _id: userId,
        items: [{ bookId, quantity }],
      });
    } else {
      // User has a cart created
      // Checking if book already in cart
      const itemIndex = cart.items.findIndex((item) =>
        item.bookId.equals(bookId)
      );

      // Book exists in cart
      if (itemIndex > -1) {
        // Increase quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Book doesn't exists in cart, add it
        cart.items.push({ bookId, quantity });
      }
    }

    // save our cart
    await cart.save();
    res.status(200).json({ message: "Book added to cart", cart });
  } catch (error) {
    // Unexpected error occured
    throw Error("Couldn't add item to the cart.");
  }
}

/**
 * Modfiy an item in cart
 * @param req - bookID, New Quantity (0 for deletion)
 * @param res - Error or Success message
 */
async function updateCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = "123"; //req.user._id
    const { bookId, quantity } = req.body;

    // Validate bookID and quanitiy
    if (!bookId || typeof quantity !== "number") {
      throw Error("bookId and quantity are required");
    }

    // Get user Cart
    const cart = await cartModel.findById(userId);
    if (!cart) {
      throw Error("Your cart is empty");
    }

    // Find which book we need to edit
    const itemIndex = cart.items.findIndex((item) =>
      item.bookId.equals(bookId)
    );

    // The book doesn't exist in user cart
    if (itemIndex === -1) {
      throw Error("This item you are trying to modifying is not in your cart");
    }

    if (quantity <= 0) {
      // If quantity 0 then we remove the book from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Check if book exists in our DB
      const book = await bookModel.findById(bookId);
      if (!book) {
        throw Error("This book is not available in stock anymore");
      }

      // Check if there is stock available
      if (!book.stock || quantity > book.stock) {
        throw Error("Quantity exceeds available stock");
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Save updated cart
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    throw Error("Couldn't update your cart");
  }
}

// Export cartController
const cartController = {
  addToCart,
  updateCart,
  viewCart,
};
export default cartController;
