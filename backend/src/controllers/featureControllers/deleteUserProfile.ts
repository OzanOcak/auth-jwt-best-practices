import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/dbConn";
import { users } from "../../db/schema";

export const deleteUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body; // Get the user ID from the request body

  try {
    // Check if the user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (!user.length) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Delete the user
    await db.delete(users).where(eq(users.id, userId)).execute();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
