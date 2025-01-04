import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores";
import { registerSchema } from "../../utils/validations";
import { RegisterForm } from "../../components/forms/RegisterForm";
import illustration from "../../assets/login.png";
import { BackgroundBase } from "../../components/BackgroundBase";
import { ROUTES } from "../../constants/constants";
import { RegisterFormData } from "../../types/auth";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { isAuthenticated } = useAuthStore();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Initialize form with yup validation
  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...rest } = data;
    if (confirmPassword === rest.password) {
      const success = await registerUser(rest);
      if (success) {
        navigate(ROUTES.LOGIN);
      }
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
          alt="register-illustration"
          className="w-2/5 h-4/5 object-cover my-auto"
        />
        <div className="flex w-2/5 h-4/5 bg-white my-auto justify-center items-center">
          <RegisterForm
            form={form}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  );
}
