import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { LoginCredentials } from "../../types/auth";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores";
import { loginSchema } from "../../utils/validations";
import { LoginForm } from "../../components/forms/LoginForm";
import illustration from "../../assets/login.png";
import { BackgroundBase } from "../../components/BackgroundBase";
import { ROUTES } from "../../constants/constants";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId") || "";
    const token = params.get("token") || "";
    const username = params.get("username") || "";
    const email = params.get("email") || "";
    const imageUrl = params.get("imageUrl") || "";
    if (token) {
      setUser(userId, email, username, token, imageUrl);
      navigate("/task");
    }
  }, []);


  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Initialize form with yup validation
  const form = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema)
  });

  // Handle form submission
  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data);
    if (success) {
      navigate(ROUTES.TASK);
    }
  };

  // Only render the page if user is not authenticated
  if (isAuthenticated) return null;

  return (
    <>
      <BackgroundBase />
      <div className="relative z-10 flex w-full h-screen justify-center items-center">
        <img
          src={illustration}
          alt="login-illustration"
          className="w-2/5 h-4/5 object-cover my-auto"
        />
        <div className="flex w-2/5 h-4/5 bg-white my-auto justify-center items-center">
          <LoginForm
            form={form}
            onSubmit={onSubmit}
            onGoogleSignIn={loginWithGoogle}
          />
        </div>
      </div>
    </>
  );
}
