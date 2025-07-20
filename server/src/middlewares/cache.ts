import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient.js";

export const cacheMiddleware = (ttlSeconds: number) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const key = `__cache__${req.originalUrl}`;
      const cached = await redisClient.get(key);

      if (cached) {
        console.log(`Cache hit: ${key}`);
        res.status(200).json(JSON.parse(cached));
        return;
      }

      // Intercept and cache the response
      const originalJson = res.json.bind(res);
      res.json = (body: unknown) => {
        redisClient
          .set(key, JSON.stringify(body), { EX: ttlSeconds })
          .then(() => {
            console.log(`Cache set: ${key}`);
          })
          .catch((err) => {
            console.error("Redis set error:", err);
          });
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Redis error:", error);
      next();
    }
  };
};
