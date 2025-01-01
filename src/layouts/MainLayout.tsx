import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { ROUTES } from '../utils/constants';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearUser, email } = useAuthStore();

  const isAuthPage = [ROUTES.LOGIN, ROUTES.REGISTER].includes(location.pathname);

  // If the user is on an auth page, render only the Outlet component
  if (isAuthPage) {
    return <Outlet />;
  }

  // Define menu items for the navigation bar
  const menuItems = [
    { path: ROUTES.TASK, label: 'Task' },
    { path: ROUTES.CALENDAR, label: 'Calendar' },
  ];

  // Handle logout functionality
  const handleLogout = () => {
    clearUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 h-[52px] px-5 flex items-center justify-between">
        {/* Navigation bar */}
        <nav className="flex-1">
          <ul className="flex space-x-6">
            {menuItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-white hover:text-gray-300 ${location.pathname === path ? 'font-semibold' : ''
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User information and logout button */}
        <div className="flex items-center space-x-4">
          <span className="text-white/80">Welcome, {email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}