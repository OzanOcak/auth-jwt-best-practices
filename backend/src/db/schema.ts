import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

// users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 10 }).default("user").notNull(),
  googleId: varchar("googleId", { length: 255 }).unique(),
});
// tokens table
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
// relations
export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));
