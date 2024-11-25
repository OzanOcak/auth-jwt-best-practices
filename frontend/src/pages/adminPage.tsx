import { useLogout } from "@/hooks/logoutHandler";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteUser } from "@/hooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/useFetchForAdmin";

export default function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();
  const accessToken = useStore((state) => state.accessToken);
  console.log(accessToken);

  const { data: allUsers, isLoading, isError: usersError } = useAdmin();
  const deleteMutation = useDeleteUser();

  const handleDeleteUser = (userId: string) => {
    deleteMutation.mutate(userId, {
      onSuccess: () => {
        // Refetch or update users after deletion
        queryClient.invalidateQueries({ queryKey: ["admin"] });
        alert("User deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      },
    });
  };

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
            <h1>{allUsers[0].role} Page:</h1>
            <h2>Hello, {allUsers[0].username}!</h2>
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
  id: string;
  username: string;
};
