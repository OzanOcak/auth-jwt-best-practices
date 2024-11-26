import axiosInstance from "@/utils/AxiosInterceptor";
import { useMutation } from "@tanstack/react-query";

// Define the shape of the signup data
type SignupData = {
  username: string;
  password: string;
};

// Function to handle registration
const signupUser = async (data: SignupData): Promise<any> => {
  // request to signup api end point and assign http response to response object
  const response = await axiosInstance.post("/signup", data);

  // Check if the response status is not OK (201 is created)
  if (response.status !== 201) {
    throw new Error(response.data.message || "Registration failed");
  }

  return response.data; // Return the response data
};

// Custom hook for registration
export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser, // The function to call for the mutation
    onSuccess: (data: any) => {
      console.log("User registered:", data);
    },
    onError: (error: Error) => {
      console.error("Registration error:", error.message);
    },
  });
};
