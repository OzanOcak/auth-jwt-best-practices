import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 10 }).default("user").notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
});

// Tokens table
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
  refreshTokenId: varchar("refresh_token_id", { length: 255 })
    .notNull()
    .unique(),
  lastUsedRefreshTokenId: varchar("last_used_refresh_token", {
    length: 255,
  }),
});

// OTPs table
export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(), // Email for OTP validation
  otp: varchar("otp", { length: 6 }).notNull(),
  expires_at: timestamp("expires_at").notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
  // otps: many(otps), // Optional: if you want to keep a relationship
}));
