import { useLogout } from "@/hooks/logoutHandler";
import { useUserName } from "@/hooks/userProfileHandler";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/useAuthStore";

export default function ProfilePage() {
  const { mutate: logout } = useLogout();
  const accessToken = useStore((state) => state.accessToken); // Subscribe to accessToken
  const { data: userData, isPending, isError, error } = useUserName();

  const handleLogout = () => {
    logout();
  };

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading user data: {error.message}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="w-4/5 max-w-5xl">
        {accessToken ? (
          <>
            <h1>Hello, {userData.username}!</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <p>Please log in</p>
        )}
      </section>
    </main>
  );
}
