import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/dbConn";
import { tokens, users } from "../../db/schema";

export const deleteUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params; // Get the user ID from the request params
  const id = Number(userId);

  try {
    // Check if the user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();

    if (!user.length) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Log the user found
    // console.log("User found:", user);

    // Delete the userId row (fk) from tokens table
    const deleteTokensResult = await db // by assigning db execution, we enforce truely it return the result, async js is always good practice assign return value
      .delete(tokens)
      .where(eq(tokens.userId, id))
      .execute();
    //console.log("Tokens deleted:", deleteTokensResult);
    deleteTokensResult;

    // Delete the user from users table
    const deleteUserResult = await db
      .delete(users)
      .where(eq(users.id, id))
      .execute();
    // console.log("User deleted:", deleteUserResult);
    deleteUserResult;

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
