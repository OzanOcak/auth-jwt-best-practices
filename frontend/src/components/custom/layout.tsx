// AdminLayout.tsx
import { useLogout } from "@/hooks/useLogout";
import { useStore } from "@/stores/useAuthStore";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const accessToken = useStore((state) => state.accessToken);
  const role = useStore((state) => state.role);
  const name = useStore((state) => state.name);

  const handleLogout = () => {
    logout();
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!accessToken) {
      navigate("/"); // Redirect to home if not authenticated
    }
  }, [accessToken, navigate]);

  return (
    <>
      <header className="bg-cream p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{role} page</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-gray-700 hover:bg-gray-200"
        >
          Logout
        </Button>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <section className="w-4/5 max-w-5xl">
          <h2>Welcome, {name}!</h2>
          <div>{children}</div>
        </section>
      </main>
    </>
  );
};

export default Layout;
