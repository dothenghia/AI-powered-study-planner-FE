import { useNavigate } from "react-router-dom";
import useMsgStore from "../stores/msgStore";
import useAuthStore from "../stores/authStore";
import { useCallback } from "react";

export const useFetchProfile = () => {
    const { setMsg } = useMsgStore();
    const navigate = useNavigate();
    const { isAuthenticated, accessToken, logout } = useAuthStore();

    const fetchProfile = useCallback(async () => {
        if (!isAuthenticated) {
            setMsg("", false);
            navigate("/login");
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response)

            if (response.status === 401) {
                const data = await response.json();
                if (data.message === "Token has expired") {
                    setMsg("Your session has expired. Please log in again.", true);
                } else if (data.message === "Invalid token") {
                    setMsg("Invalid token. Please log in again.", true);
                } else {
                    setMsg("Unauthorized access. Please log in again.", true);
                }
                logout();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                setMsg("Failed to retrieve profile information.", true);
                logout();
                navigate("/login");
                return;
            }

            // Handle success response if needed here
        } catch (error) {
            setMsg("Unable to connect to the server. Please try again later.", true);
            logout();
            navigate("/login");
        }
    }, [isAuthenticated, accessToken, logout, navigate, setMsg]);

    return { fetchProfile };
};
