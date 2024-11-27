import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db/dbConn";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import { NewUser } from "./types";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the google_users table
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.googleId, profile.id))
          .execute();

        if (existingUser.length > 0) {
          return done(null, existingUser[0]); // User found, return the user
        }

        // Create a new user in the google_users table
        const newUser: any = {
          googleId: profile.id,
          username: profile.displayName, // You can customize this as needed
          role: "user", // Default role
          password: null, // No password for Google users
        };

        const createdUser = await db.insert(users).values(newUser).execute();
        return done(null, createdUser); // Return the newly created user
      } catch (error) {
        return done(error, undefined); // Handle error
      }
    }
  )
);

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Store user ID in session
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  // Fetch user from the appropriate table based on the ID
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)))
    .execute();
  if (user.length > 0) {
    done(null, user[0]); // Return the user
  } else {
    done(null, null); // User not found
  }
});
