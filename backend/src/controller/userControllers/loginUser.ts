import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { tokens, users } from "../../db/schema";
import { db } from "../../db/dbConn";
import { randomUUID } from "node:crypto";

export const login = async (req: Request, res: Response): Promise<void> => {
  const refreshTokenId = randomUUID(); // Generate a unique ID for the refresh token

  try {
    const { username, password } = req.body; // req must be {usrname and psswd}, destruct'em
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();
    // search unique username saved in db to compare password

    if (!user.length || !(await bcrypt.compare(password, user[0].password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    //  Delete existing tokens from tokens table belonging to user
    await db.delete(tokens).where(eq(tokens.userId, user[0].id)).execute();

    //  Generate new access and refresh tokens
    const accessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.ACCESS_JWT_SECRET!,
      {
        expiresIn: "2m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.REFRESH_JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    //  Insert new token entry into the database
    await db
      .insert(tokens)
      .values({
        userId: user[0].id,
        refreshToken,
        refreshTokenId,
        lastUsedRefreshTokenId: null,
      })
      .execute();

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV! !== "development", // Prevents JavaScript access
      secure: process.env.NODE_ENV! !== "development", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    // Set the accessToken in the response header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    // response id within json body
    res.json({ refreshTokenId }); //{ refreshTokenId, accessToken, refreshToken }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};
