import { useStore } from "@/stores/useAuthStore";
import { User } from "@/types";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

// Function to fetch all users for admin
const fetchAllUsersForAdmin = async (): Promise<User[]> => {
  const { accessToken } = useStore.getState(); // Get the access token from Zustand store
  console.log(accessToken);

  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  const response = await axiosInstance.get("/admin", {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the token
    },
  });
  console.log("All Users:", response.data);
  return response.data;
};

// Custom hook for fetching all users
const useAdmin = () => {
  return useQuery({
    queryKey: ["admin"],
    queryFn: () => fetchAllUsersForAdmin(),
  });
};

export { useAdmin };
