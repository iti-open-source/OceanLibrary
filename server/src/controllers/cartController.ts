import { Request, Response, NextFunction } from "express";
import cartModel from "../models/cartModel.js";
import Book from "../models/bookModel.js";
import AppError from "../utils/appError.js";
import { CustomRequest } from "../middlewares/auth.js";
import { ICart, ICartItem, IRefBook } from "../types/entities/cart.js";

/**
 * TODO
 * 1. Add limit of max number of items a guest can add
 * 2. Add a watchdog to delete guest cart after x time
 */

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
  // Prepare transcation session
  const session = await cartModel.startSession();

  try {
    const userId = req.userId;

    // Start transcation
    session.startTransaction();

    // Get user's cart and fetch every book info from it
    const cart = await cartModel
      .findById(userId)
      .populate("items.bookId")
      .session(session);

    // User's cart is hasn't been created yet, return empty cart.
    if (!cart) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      const userCart: ICart = {
        items: [],
        total: 0,
      };
      res.status(200).json({ message: "Cart is empty", userCart });
      return;
    }

    // Cart is not empty

    // Check if requested quantites are available, if not shift it down to max available
    let updated = false;
    let filteredBooks = (cart.items as unknown as IRefBook[]).filter((item) => {
      if (item.bookId.stock <= 0) {
        updated = true;
        return false;
      }
      if (item.quantity > item.bookId.stock) {
        item.quantity = item.bookId.stock;
        updated = true;
      }
      return true;
    });

    // Save changes made to the cart
    if (updated) {
      cart.items.splice(0, cart.items.length);
      filteredBooks.forEach((item) => {
        cart.items.push({
          bookId: item.bookId._id,
          quantity: item.quantity,
        });
      });
      await cart.save({ session });
    }

    // Prepare our final cart
    const itemsList: ICartItem[] = filteredBooks.map((item) => ({
      bookId: item.bookId._id,
      title: item.bookId.title,
      author: item.bookId.authorName,
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

    // Commit
    await session.commitTransaction();
    session.endSession();

    // Return user's cart
    res.status(200).json({
      message: "Cart retrieved successfully.",
      userCart,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
  // Prepare transcation session
  const session = await cartModel.startSession();

  try {
    const userId = req.userId;
    const { bookId } = req.body;

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

    // Find which book we need to remove
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

    // Remove the book from the cart
    cart.items.splice(itemIndex, 1);

    // Save our cart and commit
    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Item successfully deleted from your cart." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
  // Prepare transcation session
  const session = await cartModel.startSession();

  try {
    const userId = req.userId;

    // Start transcation
    session.startTransaction();

    // Get user's Cart
    const cart = await cartModel.findById(userId).session(session);

    // If the user doesn't have cart then there is nothing to delete
    if (!cart) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      return next(new AppError("Your cart is already empty!", 400));
    }

    // clear the cart
    await cart.deleteOne({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Your cart has been deleted!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

/**
 * Merge guest's cart with logged in client
 * @param req - guestId
 * @param res - success or error
 * @returns
 */
export const mergeCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Prepare transcation session
  const session = await cartModel.startSession();

  try {
    const userId = req.userId;
    const { guestId } = req.body;

    // start transcation
    session.startTransaction();

    // Get user's Cart
    const cart = await cartModel.findById(userId).session(session);

    // Get guest's cart
    const guestCart = await cartModel.findById(guestId).session(session);

    // Guest has no cart, nothing to merge
    if (!guestCart) {
      // Abort transcation
      await session.abortTransaction();
      session.endSession();

      return next(new AppError("Guest had nothing in his cart to merge!", 304));
    }

    // User doesn't have cart, nothing to merge, lets create a new cart with the guest's cart
    if (!cart) {
      const newCart = new cartModel({
        _id: userId,
        items: guestCart.items,
      });

      await newCart.save({ session });
    } else {
      // Merge the existing user's cart with the guest cart
      // If client had already some of that items lets increase quantitiy
      for (const guestItem of guestCart.items) {
        const index = cart.items.findIndex((item) =>
          item.bookId.equals(guestItem.bookId)
        );
        if (index > -1) {
          cart.items[index].quantity += guestItem.quantity;
        } else {
          cart.items.push(guestItem);
        }
      }

      await cart.save({ session });
    }

    // Delete guest's cart
    await guestCart.deleteOne({ session });

    // Commit
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Your cart has merged!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
