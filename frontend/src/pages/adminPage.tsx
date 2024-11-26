import { useDeleteUser } from "@/hooks/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/hooks/useAdmin";
import Layout from "@/components/custom/layout";

import { UserItem } from "@/components/custom/userListItem";
import { useUpdateUserRole } from "@/hooks/useUpdate";
import { Pending } from "@/components/custom/isPending";
import { Erroring } from "@/components/custom/IsError";

// AdminPage.tsx
export default function AdminPage() {
  const queryClient = useQueryClient();
  const { data: allUsers, isLoading, isError } = useAdmin();
  const deleteMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();

  const handleDeleteUser = (userId: string) => {
    if (isNaN(Number(userId))) {
      alert("Invalid user ID");
      return;
    }

    deleteMutation.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin"] });
        alert("User deleted successfully");
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      },
    });
  };

  const handleUpdateUserRole = (userId: string, newRole: string) => {
    if (!["user", "admin", "editor"].includes(newRole)) {
      alert("Invalid role");
      return;
    }

    updateRoleMutation.mutate(
      { userId, newRole },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admin"] });
          alert("User role updated successfully");
        },
        onError: (error) => {
          console.error("Error updating user role:", error);
          alert("Failed to update user role. Please try again.");
        },
      }
    );
  };

  if (isLoading) return <Pending />;
  if (isError) return <Erroring />;

  if (!Array.isArray(allUsers)) {
    return <p>Unexpected data format.</p>;
  }

  return (
    <Layout>
      <div className="mt-8">
        <h2 className="text-2xl font-bold">List of All Users:</h2>
        <ul className="mt-4 space-y-4">
          {allUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              handleDeleteUser={handleDeleteUser}
              handleUpdateUserRole={handleUpdateUserRole}
            />
          ))}
        </ul>
      </div>
    </Layout>
  );
}
