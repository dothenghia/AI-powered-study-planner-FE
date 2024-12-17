import { BackgroundBase } from "./components/BackgroundBase";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import RouterError from "./components/RouterError";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { Profile } from "./components/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SignIn />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <RouterError />,
  },
  {
    path: "/login",
    element: <SignIn />,
    errorElement: <RouterError />,
  },
  {
    path: "/register",
    element: <SignUp />,
    errorElement: <RouterError />,
  },
]);

function App() {
  return (
    <>
      <BackgroundBase />
      <div className="relative z-10">
        {" "}
        {/* Ensure content appears on top of the background */}
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
