import { Request, Response, NextFunction } from "express";
import cartModel from "../models/cartModel.js";
import Book from "../models/bookModel.js";
import AppError from "../utils/appError.js";
import { CustomRequest } from "../middlewares/auth.js";
import { ICart, ICartItem, IRefBook } from "../types/entities/cart.js";

/**
 * View cart - Displays cart items and total amount
 * @param req
 * @param res - items[], total<number>
 */
export const viewCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    // Get user's cart and fetch every book info from it
    const cart = await cartModel.findById(userId).populate("items.bookId");

    // User's cart is hasn't been created yet, return empty cart.
    if (!cart) {
      const userCart: ICart = {
        items: [],
        total: 0,
      };

      res.status(200).json({ message: "Cart is empty", userCart });
      return;
    }

    // Cart is not empty, Load books into cart
    const itemsList: ICartItem[] = (cart.items as unknown as IRefBook[])
      .filter((item) => item.bookId)
      .map((item) => ({
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

    // User cart
    const userCart: ICart = {
      items: itemsList,
      total: totalAmount,
    };

    // Return user's cart
    res.status(200).json({
      message: "Cart retrieved successfully.",
      userCart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart - Used in Book page (Add to cart)
 * @param req - BookID, Quantity
 * @param res - Error or Success message
 */
export const addToCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Prepare transcation session
  const session = await cartModel.startSession();

  try {
    const userId = req.userId;
    const { bookId, quantity } = req.body;

    // Start transcation
    session.startTransaction();

    // Fetch Book info
    const book = await Book.findById(bookId).session(session);
    // Book doesn't exists
    if (!book) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      return next(
        new AppError(
          "Sorry, we couldn’t find the book you’re looking for.",
          400
        )
      );
    }

    // Verify the book Stock
    if (!book.stock || book.stock < quantity) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      // Return stock limit error
      return next(
        new AppError(
          `Only ${book.stock} items left in stock - please adjust your quantity.`,
          400
        )
      );
    }

    // Get user cart
    let cart = await cartModel.findById(userId).session(session);

    // User doesn't have a cart yet
    if (!cart) {
      // Create a new cart with the requested book
      cart = new cartModel({
        _id: userId,
        items: [{ bookId, quantity }],
      });
    } else {
      // User has a cart created already
      // Checking if book already in cart
      const itemIndex = cart.items.findIndex((item) =>
        item.bookId.equals(bookId)
      );

      // Book exists in cart
      if (itemIndex > -1) {
        // Check if its possible to increase quantity
        const currentQuantity = cart.items[itemIndex].quantity;
        const futureQuantity = currentQuantity + quantity;

        // There is no enough stock available to add up
        if (futureQuantity > book.stock) {
          // Abort transcation
          await session.abortTransaction();
          session.endSession();

          // Return stock limit error
          return next(
            new AppError(
              `You can’t add more of this item - stock limit reached.`,
              400
            )
          );
        }

        // Increase quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Book doesn't exists in cart, add it
        cart.items.push({ bookId, quantity });
      }
    }

    // save cart and commit
    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Book added! View cart to proceed." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * Modify an item in cart
 * @param req - bookID, New Quantity (0 for deletion)
 * @param res - Error or Success message
 */
export const updateCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Prepare transcation session
  const session = await cartModel.startSession();

  try {
    const userId = req.userId;
    const { bookId, quantity } = req.body;

    // Start transcation
    session.startTransaction();

    // Get user Cart
    const cart = await cartModel.findById(userId).session(session);
    if (!cart) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      return next(
        new AppError("You haven’t added anything to your cart yet.", 400)
      );
    }

    // Find which book we need to edit
    const itemIndex = cart.items.findIndex((item) =>
      item.bookId.equals(bookId)
    );

    // The book doesn't exist in user cart
    if (itemIndex === -1) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      return next(
        new AppError(
          "Oops! That item isn’t available in your cart anymore.",
          400
        )
      );
    }

    if (quantity <= 0) {
      // If quantity 0 then we remove the book from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Check if book exists in our DB
      const book = await Book.findById(bookId).session(session);
      if (!book) {
        // Abort transcation
        await session.abortTransaction();
        session.endSession();

        return next(
          new AppError("This book is not available in stock anymore", 400)
        );
      }

      // Check if there is stock available
      if (!book.stock || quantity > book.stock) {
        // Abort transcation
        await session.abortTransaction();
        session.endSession();

        return next(
          new AppError(
            `Only ${book.stock} items left in stock - please adjust your quantity.`,
            400
          )
        );
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Save updated cart and commit
    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Your cart has been updated" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * Remove specific book from cart
 * @param req - bookId to be removed
 * @param res - success or error message
 */
export const removeFromCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const { bookId } = req.body;

    // Get user Cart
    const cart = await cartModel.findById(userId);
    if (!cart) {
      return next(
        new AppError("You haven’t added anything to your cart yet.", 400)
      );
    }

    // Find which book we need to remove
    const itemIndex = cart.items.findIndex((item) =>
      item.bookId.equals(bookId)
    );

    // The book doesn't exist in user cart
    if (itemIndex === -1) {
      return next(
        new AppError(
          "Oops! That item isn’t available in your cart anymore.",
          400
        )
      );
    }

    // Remove the book from the cart
    cart.items.splice(itemIndex, 1);

    // Save our cart
    await cart.save();
    res
      .status(200)
      .json({ message: "Item successfully deleted from your cart." });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all items in cart
 * @param req - Valid userID
 * @param res - Error or success message
 */
export const deleteCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    // Get user's Cart
    const cart = await cartModel.findById(userId);

    // If the user doesn't have cart then there is nothing to delete
    if (!cart) {
      return next(new AppError("Your cart is already empty!.", 400));
    }

    // clear the cart
    await cart.deleteOne();
    res.status(200).json({ message: "Your cart has been deleted!" });
  } catch (error) {
    next(error);
  }
};
