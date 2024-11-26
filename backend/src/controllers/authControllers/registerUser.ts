import { Request, Response } from "express";
import { CreateUserDTO } from "../../types";
import bcrypt from "bcryptjs";
import { db } from "../../db/dbConn";
import { otps, users } from "../../db/schema";
import { addMinutes } from "date-fns";
import nodemailer from "nodemailer";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email }: CreateUserDTO = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({ username, password: hashedPassword, email, role: "user" }) // password:hashedPassword
      .returning(); // returns an array from users table

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = addMinutes(new Date(), 3); // Set expiration time to 3 minutes

    // Save OTP to the database
    const otpVar = await db.insert(otps).values({
      email,
      otp,
      expires_at: expiresAt,
    });

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable
        pass: process.env.EMAIL_PASS, // Use environment variable
      },
    });
    console.log("t:", transporter);

    const sentEmail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 3 minutes.`,
    });
    console.log("s:", sentEmail);

    // Exclude password from the response
    const { password: _, ...userResponse } = newUser[0];
    console.log("u:", userResponse);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for the OTP.",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};
