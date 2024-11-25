export type UserRole = "admin" | "editor" | "user";

export const roles: Record<UserRole, { permissions: string[] }> = {
  admin: {
    permissions: [
      "view_profile",
      "view_users",
      "edit_user_role",
      "delete_user",
    ],
  },
  editor: {
    permissions: ["view_profile", "view_users"],
  },
  user: {
    permissions: ["view_profile"],
  },
};
