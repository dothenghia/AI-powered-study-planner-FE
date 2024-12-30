import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { LoginCredentials } from "../../types/auth";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../utils/validations";
import { LoginForm } from "../../components/forms/LoginForm";
import illustration from "../../assets/login.png";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const form = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data);
    if (success) {
      navigate("/task");
    }
  };

  return (
    <div className="flex w-full h-screen">
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
  );
} 