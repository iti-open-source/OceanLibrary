import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({ status: "fail", message: "too many requests" });
  },
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: function (req, res) {
    res
      .status(429)
      .json({ status: "fail", message: "too many login requests" });
  },
});
