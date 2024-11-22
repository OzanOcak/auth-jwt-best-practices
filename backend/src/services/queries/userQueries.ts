import { eq } from "drizzle-orm";
import { db } from "../../db/dbConn";

export const getUser = async (users: any, username: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .execute();
  return user[0];
};
