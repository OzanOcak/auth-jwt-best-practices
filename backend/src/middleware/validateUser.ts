import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const UserSchema = z.object({
  username: z.string().min(4, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    UserSchema.parse(req.body); // This will throw if the validation fails
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Validation Error",
        issues: error.errors,
      });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
