import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});
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
export const usersRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));
