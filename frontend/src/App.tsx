import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/error";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import ProfilePage from "./pages/page";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ErrorBoundary
        fallback={<div>Something went wrong while loading the login page.</div>}
      >
        <LoginPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/",
    element: (
      <ErrorBoundary
        fallback={
          <div>Something went wrong while loading the signup page.</div>
        }
      >
        <SignupPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "/profile",
    element: (
      <ErrorBoundary
        fallback={
          <div>Something went wrong while loading the signup page.</div>
        }
      >
        <ProfilePage />
      </ErrorBoundary>
    ),
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
