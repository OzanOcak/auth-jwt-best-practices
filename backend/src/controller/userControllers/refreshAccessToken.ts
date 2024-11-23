import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokens } from "../../db/schema";
import { db } from "../../db/dbConn";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export const getAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshTokenId } = req.body; // Expecting payload with refreshTokenId and refreshToken

  if (!refreshTokenId) {
    res.status(400).json({ message: "Refresh token ID is required." });
    return;
  }

  try {
    const tokenEntry = await db
      .select()
      .from(tokens)
      .where(eq(tokens.refreshTokenId, refreshTokenId))
      .execute();

    //tokenEntry:{id: 1,userId: 2,refreshToken: '',refreshTokenId: '',lastUsedRefreshTokenId: null}
    // console.log(tokenEntry);

    if (!tokenEntry.length) {
      res.status(403).json({ message: "Invalid refresh token ID." });
      return; // if empty res.status(403)
    }

    // Retrieve the refresh token from the cookie
    const refreshToken = req.cookies.refreshToken;
    const lastUsedRefreshTokenId = tokenEntry[0].lastUsedRefreshTokenId;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token not found." });
      return;
    }

    // Verify the refresh token comes with cookie
    jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!,
      async (err: jwt.JsonWebTokenError | null, payload: any) => {
        // console.log("payload: " + JSON.stringify(payload));

        if (err) {
          return res.status(401).json({ message: "Invalid refresh token." });
        }

        const payloadId = payload.id; // Extract id from payload
        const payloadRole = payload.role;

        // Ensure the payload ID is valid
        if (typeof payloadId !== "number") {
          return res.status(400).json({ message: "Invalid payload ID." });
        }

        // Check for token reuse
        if (refreshTokenId === lastUsedRefreshTokenId) {
          return res
            .status(403)
            .json({ message: "Refresh token has been reused." });
        }

        // Generate a new refresh token and refresh token ID
        const newRefreshToken = jwt.sign(
          { id: payloadId },
          process.env.REFRESH_JWT_SECRET!,
          {
            expiresIn: "7d",
          }
        );

        const newRefreshTokenId = randomUUID(); // New UUID for the refresh token ID

        // Generate a new access token
        const newAccessToken = jwt.sign(
          { id: payloadId, role: payloadRole },
          process.env.ACCESS_JWT_SECRET!,
          {
            expiresIn: "2m", // Short-lived access token
          }
        );
        // Set the accessToken in the response header
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        // Set the refresh token in a cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: process.env.NODE_ENV! !== "development", // Prevents JavaScript access
          secure: process.env.NODE_ENV! !== "development", // Use secure cookies in production
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "strict", // Helps prevent CSRF attacks
        });

        // Update the database with the new refresh token and mark the old one as last used
        await db
          .update(tokens)
          .set({
            refreshToken: newRefreshToken, // Store the new refresh token
            refreshTokenId: newRefreshTokenId, // Update to the new refresh token ID
            lastUsedRefreshTokenId: refreshTokenId, // Set the old refresh token ID as last used
          })
          .where(eq(tokens.userId, payloadId))
          .execute();

        // Respond with the new access token, new refresh token, and new refresh token ID
        res.json({
          refreshTokenId: newRefreshTokenId, // Return the new refresh token ID
        });
      }
    );
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "Error refreshing access token." });
  }
};
