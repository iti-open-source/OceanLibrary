import { NextFunction, Response } from "express";
import { CustomRequest } from "./auth.js";

export const setGuestId = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Check if auth header exits
    const authHeader = req.headers["authorization"];

    // If it doesn't exists then the user is a guest
    if (!authHeader) {
      // Check if the guest suppled a valid guest id
      const guestId = req.headers["x-guest-id"];
      if (
        typeof guestId === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          guestId
        )
      ) {
        req.userId = guestId;
        req.userRole = "guest";
      }
    }

    // Move on to JWT middleware
    next();
  } catch (error) {
    next(error);
  }
};
