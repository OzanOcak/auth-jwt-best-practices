import { Request, Response } from "express";
import { db } from "../../db/dbConn";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { console } from "inspector";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    // Fetch user data from the database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .execute();

    if (user.length === 0) {
      res.sendStatus(404);
      return;
    }
    // Send user data excluding sensitive information
    //const { password, ...userProfile } = user[0];
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile." });
  }
};
