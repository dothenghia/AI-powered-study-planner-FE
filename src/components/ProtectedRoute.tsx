import { ReactNode } from "react";
import { useAuthStore } from "../stores";
import { Button } from "./ui/Button";
import { ROUTES } from "../constants/constants";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
	children: ReactNode;
	guestContent?: ReactNode;
};

export const ProtectedRoute = ({ children, guestContent }: ProtectedRouteProps) => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] bg-gray-50">
				{guestContent || (
					<div className="text-center">
						<h2 className="text-2xl font-semibold text-gray-800 mb-4">
							Please Log In to Access This Feature
						</h2>
						<Button variant="primary" onClick={() => navigate(ROUTES.LOGIN)}>
							Log In
						</Button>
					</div>
				)}
			</div>
		);
	}

	return <>{children}</>;
};
