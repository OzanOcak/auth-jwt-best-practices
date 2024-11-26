import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const UserSchema = z.object({
  username: z.string().min(4, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email format"),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = UserSchema.safeParse(req.body); // with safeParse, we dont need try,cach unlike parse.

  if (!result.success) {
    res.status(400).json({
      message: "Validation Error",
      issues: result.error.errors,
    });
    return; // Stop further execution
  }

  next(); // Proceed to the next middleware/controller if validation is successful
};
