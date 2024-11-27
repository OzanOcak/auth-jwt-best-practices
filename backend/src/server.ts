import express from "express";
import { connectDatabase } from "./db/dbConn";
import authRoutes from "./routes/authRoutes";
import roleRoutes from "./routes/roleRoutes";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Optionally, run migrations or initialize other resources here
    await connectDatabase();
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    // Enable CORS for all routes
    app.use(
      cors({
        origin: "http://localhost:5173", //  frontend origin
        credentials: true, // Allow credentials
        exposedHeaders: ["Authorization"], // Expose the Authorization header
      })
    );

    // Set up session middleware
    app.use(
      session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
      })
    );

    // Initialize Passport.js
    app.use(passport.initialize());
    app.use(passport.session());

    // Authentication routes
    app.get(
      "/api/auth/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );

    app.get(
      "/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/" }),
      (req, res) => {
        // Successful authentication, redirect to your desired route
        res.redirect("http://localhost:5173"); // Redirect to your frontend
      }
    );

    app.use("/api", authRoutes);
    app.use("/api", roleRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
