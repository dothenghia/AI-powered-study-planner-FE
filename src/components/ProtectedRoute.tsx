import { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

type ProtectedRouteProps = {
    children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return <>{children}</>;
};
