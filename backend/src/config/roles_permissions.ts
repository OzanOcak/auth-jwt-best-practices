export type UserRole = "admin" | "editor" | "user";

export const roles: Record<UserRole, { permissions: string[] }> = {
  admin: {
    permissions: ["view_users", "edit_user_roles", "delete_users"],
  },
  editor: {
    permissions: ["view_users"],
  },
  user: {
    permissions: ["view_profile"],
  },
};
