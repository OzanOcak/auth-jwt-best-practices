import { Erroring } from "@/components/custom/IsError";
import { Pending } from "@/components/custom/isPending";
import Layout from "@/components/custom/layout";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import useAllUsers from "@/hooks/useAllUsers";
import { useStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditorPage() {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const accessToken = useStore((state) => state.accessToken);
  console.log(accessToken);

  const {
    data: allUsers,
    isError: usersError,
    isPending,
    isError,
  } = useAllUsers();

  // Use useEffect to navigate based on the accessToken
  useEffect(() => {
    if (!accessToken) {
      navigate("/"); // Redirect to home if not authenticated
    }
  }, [accessToken, navigate]); // Only run effect when accessToken changes

  if (isPending) return <Pending />;
  if (isError) return <Erroring />;

  // Check if allUsers is indeed an array
  if (!Array.isArray(allUsers)) {
    return <p>Unexpected data format.</p>; // Handle unexpected format
  }

  return (
    <Layout>
      <ul>
        {allUsers.map((user: User) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </Layout>
  );
}
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};
