import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { console } from "inspector";
import { db } from "../../db/dbConn";
import { users } from "../../db/schema";

// Controller to get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allUsers: User[] = await db.select().from(users).execute();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};
