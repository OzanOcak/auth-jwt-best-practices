import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

// Function to handle user logout
const logoutUser = async (): Promise<void> => {
  const refreshTokenId = localStorage.getItem("refreshTokenId");

  if (!refreshTokenId) {
    throw new Error("No refresh token ID found for logout.");
  }

  // Attempt to log out
  try {
    const response = await axiosInstance.post(
      "/logout",
      { refreshTokenId }
      // Send access token in the header with default axiosInstance request
    );
    // Handle 403 error specifically
    if (response.status === 403) {
      alert("Your session has expired. Please log in again.");
      clearToken();
      window.location.href = "/"; // Redirect to login
      return;
    }
  } catch (error) {
    console.error("Logout failed:", error);

    throw new Error("Logout failed due to an unexpected error.");
  }

  // Clear tokens from local storage
  clearToken();
};

// Function to clear tokens from local storage
const clearToken = () => {
  localStorage.removeItem("refreshTokenId");
  useStore.getState().clearToken();
};

// Custom hook for logout
export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
    mutationKey: ["logout"],
    onSuccess: () => {
      console.log("User logged out successfully.");
      // Optionally redirect to login or home page
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error.message);
    },
  });
};
