import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { ForgotPassword } from "../../types/auth";
import { useAuthStore } from "../../stores";
import { forgotPasswordSchema } from "../../utils/validations";
import illustration from "../../assets/login.png";
import { BackgroundBase } from "../../components/BackgroundBase";
import { ROUTES } from "../../constants/constants";
import { ForgotPasswordForm } from "../../components/forms/ForgotPasswordForm";
import { useAuth } from "../../hooks/useAuth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { sendResetPasswordLink } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Initialize form with yup validation
  const form = useForm<ForgotPassword>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  // Handle form submission
  const onSubmit = async (data: ForgotPassword) => {
    const success = await sendResetPasswordLink(data.email);
    if (success) {
      navigate(ROUTES.LOGIN);
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
          <ForgotPasswordForm
            form={form}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  );
}
