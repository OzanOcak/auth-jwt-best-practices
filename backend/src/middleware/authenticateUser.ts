import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { extractAccessToken } from "../utils/getExtractedAccessToken";

dotenv.config(); // Load environment variables

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = extractAccessToken(req, res);

  // Check if token is present to stasfy ts for undefined possibility
  if (!accessToken) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Verify the token
  jwt.verify(
    accessToken,
    process.env.ACCESS_JWT_SECRET || "",
    (err, payload) => {
      if (err) {
        // Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ message: "Unauthorized: Token has expired" });
          return;
        }
        // Any other error (e.g., invalid token)
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
      }

      // Set userId in request if token is valid
      req.userId = (payload as any).id; // Ensure correct typing

      //console.log("Authenticated user ID:", req.userId);
      next();
    }
  );
};
