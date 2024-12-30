import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, email } = useAuthStore();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  
  if (isAuthPage) {
    return <Outlet />;
  }

  const menuItems = [
    { path: '/task', label: 'Task Management' },
    { path: '/view', label: 'Calendar View' },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 h-[52px] px-5 flex items-center justify-between">
        <nav className="flex-1">
          <ul className="flex space-x-6">
            {menuItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-white hover:text-gray-300 ${
                    location.pathname === path ? 'font-semibold' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
} 