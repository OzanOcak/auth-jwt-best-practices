import { Request, Response } from "express";
import { CreateUserDTO } from "../../types";
import bcrypt from "bcryptjs";
import { db } from "../../db/dbConn";
import { users } from "../../db/schema";

export const register = async (req: Request, res: Response) => {
  const { username, password }: CreateUserDTO = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({ username, password: hashedPassword, role: "admin" }) // password:hashedPassword
      .returning(); // returns an array from users table

    // Exclude password from the response
    const { password: _, ...userResponse } = newUser[0];

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};
