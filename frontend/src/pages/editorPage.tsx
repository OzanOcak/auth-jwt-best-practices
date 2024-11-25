import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/logoutHandler";
import useAllUsers from "@/hooks/useAllUsers";
import { useStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditorPage() {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const accessToken = useStore((state) => state.accessToken);
  console.log(accessToken);

  const { data: allUsers, isLoading, isError: usersError } = useAllUsers();

  const handleLogout = () => {
    logout();
  };

  // Use useEffect to navigate based on the accessToken
  useEffect(() => {
    if (!accessToken) {
      navigate("/"); // Redirect to home if not authenticated
    }
  }, [accessToken, navigate]); // Only run effect when accessToken changes

  if (isLoading) return <p>Loading all users...</p>;
  if (usersError) return <p>Error loading users: {usersError}</p>;

  // Check if allUsers is indeed an array
  if (!Array.isArray(allUsers)) {
    return <p>Unexpected data format.</p>; // Handle unexpected format
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="w-4/5 max-w-5xl">
        {accessToken ? (
          <>
            <h1>Hello, {allUsers[0].username}!</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
            <h2 className="mt-8">List of All Users:</h2>
            <ul>
              {allUsers.map((user: User) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>Please log in</p>
        )}
      </section>
    </main>
  );
}
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};
