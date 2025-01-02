import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { ROUTES } from '../utils/constants';
import { Button } from '../components/ui/Button';

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
                      : ''
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
          <span className="text-gray-700">Welcome, {email}</span>
          <Button onClick={handleLogout} variant="gray">Logout</Button>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 pt-[52px]">
        <Outlet />
      </main>
    </div>
  );
}