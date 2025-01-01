import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { ROUTES } from "../utils/constants";

type ProtectedRouteProps = {
    children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    // If the user is authenticated, navigate to the task page
    // Otherwise, navigate to the login page
    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.TASK);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    return <>{children}</>;
};
