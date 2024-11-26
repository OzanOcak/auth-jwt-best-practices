import { User } from "../../controllers/featureControllers/getAllUsers";
import { db } from "../../db/dbConn";
import { users } from "../../db/schema";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const allUsers: User[] = await db.select().from(users).execute();
    return allUsers; // Return the data instead of sending a response
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users"); // Throw an error to be caught in admin
  }
};
