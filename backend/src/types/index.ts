import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // To store user ID after authentication
    }
  }
}
export const UserSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(6).max(255),
});

export type CreateUserDTO = z.infer<typeof UserSchema>;
// this file is needed to be exporded to declare userId

export type JWTPayload = {
  id: number; // user[0].id is number
};
