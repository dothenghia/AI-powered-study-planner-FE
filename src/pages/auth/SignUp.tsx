import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema } from "../../utils/validations";
import { RegisterForm } from "../../components/forms/RegisterForm";
import illustration from "../../assets/login.png";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(data);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="flex w-full h-screen">
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
  );
}
