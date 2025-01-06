import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { ROUTES } from "../constants/constants";
import { Button } from "../components/ui/Button";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../stores/themeStore";
import { useEffect } from "react";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser, email, username, imageUrl, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
          theme={theme}
          transition={Slide}
          toastClassName={"w-fit px-5 !min-h-14"}
          closeButton={false}
        />
        <Outlet />
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="fixed z-50 bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700 group"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
          ) : (
            <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          )}
        </button>
      </>
    );
  }

  // Define menu items for the navigation bar
  const menuItems = [
    { path: ROUTES.TASK, label: "Task" },
    { path: ROUTES.CALENDAR, label: "Calendar" },
    { path: ROUTES.ANALYTICS, label: "Analytics" },
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
        theme={theme}
        transition={Slide}
        toastClassName={"w-fit px-5 !min-h-14"}
        closeButton={false}
      />

      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 h-[52px] px-5 flex items-center justify-between shadow-md z-50">
        {/* Navigation bar */}
        <nav className="flex-1">
          <ul className="flex space-x-6">
            {menuItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative pb-4 ${
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

        {/* User information */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to={ROUTES.PROFILE}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-3">
                  <img
                    src={imageUrl || "/avatar-placeholder.png"}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{email}</span>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="gray">
                  Logout
                </Button>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate(ROUTES.LOGIN)} variant="primary">
                Login
              </Button>
              <Button onClick={() => navigate(ROUTES.REGISTER)} variant="outline">
                Register
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 pt-[52px]">
        <Outlet />
      </main>

      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed z-50 bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700 group"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        )}
      </button>
    </div>
  );
}
