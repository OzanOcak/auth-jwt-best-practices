import { eq } from "drizzle-orm";
import { db } from "../../db/dbConn";
import { User } from "../../controllers/featureControllers/getAllUsers";
import { users } from "../../db/schema";

export const getUser = async (userId: number): Promise<User> => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();

    if (user.length === 0) {
      throw new Error("User not found"); // Throw an error if user not found
    }

    return user[0];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users"); // Throw an error to be caught in admin
  }
};
