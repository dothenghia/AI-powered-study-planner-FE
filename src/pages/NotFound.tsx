import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../constants/constants";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to={ROUTES.HOME}>
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
