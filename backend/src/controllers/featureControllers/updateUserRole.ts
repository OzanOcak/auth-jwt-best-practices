import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { console } from "inspector";
import { db } from "../../db/dbConn";
import { users } from "../../db/schema";

// Controller to update user role
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, newRole } = req.body; // User ID and new role from request
  const validRoles = ["user", "admin", "editor"]; // Define valid roles

  if (!validRoles.includes(newRole)) {
    res.status(400).json({ message: "Invalid role" });
    return;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (!user.length) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId))
      .execute();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role" });
  }
};
