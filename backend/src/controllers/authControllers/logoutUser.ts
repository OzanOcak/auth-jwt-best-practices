import { Request, Response } from "express";
import { db } from "../../db/dbConn";
import { tokens } from "../../db/schema";
import { eq } from "drizzle-orm";
import { extractAccessToken } from "../../utils/getExtractedAccessToken";

export const logout = async (req: Request, res: Response) => {
  const { refreshTokenId } = req.body; // Only get refreshTokenId from request body

  const accessToken = extractAccessToken(req, res);

  if (!accessToken || !refreshTokenId) {
    res
      .status(400)
      .json({ message: "Refresh token and refresh token ID are required" });
    return;
  }

  // Delete the refresh token from the database
  try {
    const result = await db
      .delete(tokens)
      .where(eq(tokens.refreshTokenId, refreshTokenId))
      .execute(); // execute sql query and assign return value to result

    // Check the number of affected rows
    if (result.rowCount === 0) {
      res.status(204).json({ message: "No token found to delete" });
      return;
    }

    // Clear the refresh token cookie (if applicable)
    res.clearCookie("refreshToken"); // Adjust cookie name if different

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};
