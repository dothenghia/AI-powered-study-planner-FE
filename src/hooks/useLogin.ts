import { useCallback } from "react";
import useAuthStore from "../stores/authStore";

type LoginData = {
    email: string;
    password: string;
};

export const useLogin = () => {
    const { setUser } = useAuthStore();
    const apiUrl = import.meta.env.VITE_API_URL;

    const login = useCallback(
        async (data: LoginData) => {
            try {
                const response = await fetch(`${apiUrl}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to log in");
                }

                const {
                    email,
                    username,
                    access_token: accessToken,
                } = await response.json();

                setUser(email, username, accessToken);
            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
        },
        [apiUrl, setUser]
    );

    return { login };
};
