import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({
      status: "fail",
      message:
        "We're sorry, but we can't process your request right now because you've sent too many requests in a short period. Please try again later.",
    });
  },
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({
      status: "fail",
      message:
        "We're sorry, but we can't process your request right now because you've sent too many requests in a short period. Please try again later.",
    });
  },
});

export const emailRequestsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 1,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: function (req, res) {
    res.status(429).json({
      status: "fail",
      message:
        "We're sorry, but we can't process your request right now because you've sent too many requests in a short period. Please try again later.",
    });
  },
});
