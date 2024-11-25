// utils/routing.ts
export const redirectUser = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin";
    case "editor":
      return "/editor";
    case "profile":
      return "/profile";
    default:
      return "/profile";
  }
};
