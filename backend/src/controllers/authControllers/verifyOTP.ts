import { Request, Response } from "express";
import { db } from "../../db/dbConn";
import { otps } from "../../db/schema";
import { and, eq, gt } from "drizzle-orm";

// OTP verification route
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    // Check if the OTP is valid and not expired
    const otpRecord = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.email, email),
          eq(otps.otp, otp),
          gt(otps.expires_at, new Date())
        )
      )
      .execute();

    const otpRes = otpRecord[0];

    if (!otpRes) {
      res.status(400).json({ message: "Invalid or expired OTP." });
      return;
    }

    // OTP is valid, you can now activate the user or perform any other action
    res.status(200).json({ message: "OTP verified successfully." });

    // Optionally, delete the OTP record after verification
    await db.delete(otps).where(eq(otps.id, otpRes.id));
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};
