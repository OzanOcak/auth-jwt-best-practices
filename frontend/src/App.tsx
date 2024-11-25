import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/error";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import ProfilePage from "./pages/userPage";
import EditorPage from "./pages/editorPage";
import AdminPage from "./pages/adminPage";
import ProtectedRoute from "./components/protectedRoute";

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
      <ProtectedRoute requiredRoles={["user"]}>
        <ErrorBoundary
          fallback={
            <div>Something went wrong while loading the signup page.</div>
          }
        >
          <ProfilePage />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
  },
  {
    path: "/editor",
    element: (
      <ProtectedRoute requiredRoles={["editor"]}>
        <ErrorBoundary
          fallback={
            <div>Something went wrong while loading the editor page.</div>
          }
        >
          <EditorPage />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <ErrorBoundary
          fallback={
            <div>Something went wrong while loading the admin page.</div>
          }
        >
          <AdminPage />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
