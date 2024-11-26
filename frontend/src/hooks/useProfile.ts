import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useQuery } from "@tanstack/react-query";

const fetchUserName = async () => {
  //const token = localStorage.getItem("accessToken");
  const { accessToken } = useStore.getState(); // Get the access token from Zustand store
  //console.log(accessToken); // Log the token for debugging
  // Check if accessToken exists
  if (!accessToken) {
    throw new Error("No access token found: profile");
  }

  const response = await axiosInstance.get("/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Include the token
    },
  });
  return response.data[0];
};

export const useUserName = () => {
  //const accessToken = useStore((state) => state.accessToken); // Subscribe to accessToken changes

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchUserName(),
    //enabled: Boolean(accessToken), // Only run this query if accessToken exists
  });
};
