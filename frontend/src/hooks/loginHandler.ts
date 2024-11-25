import { useStore } from "@/stores/useAuthStore";
import axiosInstance from "@/utils/AxiosInterceptor";
import { redirectUser } from "@/utils/routing";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Define the shape of the login data
type LoginData = {
  username: string;
  password: string;
};

// Function to handle user login
const loginUser = async (
  data: LoginData
): Promise<{
  refreshTokenId: string;
}> => {
  // Use axiosInstance to make the POST request
  const response = await axiosInstance.post("/login", data, {
    withCredentials: true, // Allows credentials (cookies) to be sent
  });
  //console.log(response);

  // Check if the response status is not OK (2xx)
  if (response.status !== 200) {
    throw new Error(response.data.message || "Login failed");
  }
  // Get the refreshTokenId from the response body
  const { refreshTokenId } = response.data;

  // Access the Authorization header
  const authorizationHeader =
    response.headers["authorization"] || response.headers["Authorization"];
  const accessToken = authorizationHeader?.split(" ")[1];
  console.log("access token from login:", accessToken);
  if (accessToken) {
    // Store the access token in local storage
    //localStorage.setItem("accessToken", accessToken);
    const payload = jwtDecode(accessToken) as { id: string; role: string };
    useStore.getState().setToken(accessToken);
    useStore.getState().setRole(payload.role); // instead of passing access to refresh tokens
  } else {
    throw new Error("Access token not received");
  }

  // Store the refresh token ID in local storage
  try {
    localStorage.setItem("refreshTokenId", refreshTokenId);
    //console.log("Refresh token ID stored:", refreshTokenId);
    const { accessToken } = useStore.getState(); // Get the access token from Zustand store
    console.log("access toke from z store:", accessToken); // Log the token for debugging
  } catch (error) {
    console.error("Error storing refresh token ID:", error);
  }

  return { refreshTokenId }; // Return the entire token object if needed
};

// Custom hook for login
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser, // The function to call for the mutation
    onSuccess: (data) => {
      console.log(
        "Login successful, refresh token ID stored:" /*,data.refreshTokenId */
      );
      const { role } = useStore.getState(); // Get the role from Zustand store

      // Redirect based on user role
      navigate(redirectUser(role));
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message);
    },
  });
};
