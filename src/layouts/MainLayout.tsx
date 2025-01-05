import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { ROUTES } from "../constants/constants";
import { Button } from "../components/ui/Button";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser, email, username, imageUrl } = useAuthStore();

  const isAuthPage = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.EMAIL_VERIFICATION,
  ].includes(location.pathname);

  // If the user is on an auth page, render only the Outlet component
  if (isAuthPage) {
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={2345}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
          transition={Slide}
          toastClassName={"w-fit px-5 !min-h-14"}
          closeButton={false}
        />
        <Outlet />
      </>
    );
  }

  // Define menu items for the navigation bar
  const menuItems = [
    { path: ROUTES.TASK, label: "Task" },
    { path: ROUTES.CALENDAR, label: "Calendar" },
  ];

  // Handle logout functionality
  const handleLogout = () => {
    clearUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-center"
        autoClose={2345}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
        toastClassName={"w-fit px-5 !min-h-14"}
        closeButton={false}
      />

      <header className="fixed top-0 left-0 right-0 bg-white h-[52px] px-5 flex items-center justify-between shadow-md z-50">
        {/* Navigation bar */}
        <nav className="flex-1">
          <ul className="flex space-x-6">
            {menuItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-gray-700 hover:text-gray-900 relative pb-4 ${
                    location.pathname === path
                      ? 'font-semibold after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-blue-500'
                      : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User information and logout button */}
        <Link to={ROUTES.PROFILE}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <img
                src={imageUrl || "/avatar-placeholder.png"}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {username}
                </span>
                <span className="text-xs text-gray-500">{email}</span>
              </div>
            </div>
            <Button onClick={handleLogout} variant="gray">
              Logout
            </Button>
          </div>
        </Link>
      </header>

      {/* Main content area */}
      <main className="flex-1 pt-[52px]">
        <Outlet />
      </main>
    </div>
  );
}
