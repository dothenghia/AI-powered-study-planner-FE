import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ROUTES } from "../../utils/constants";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => Promise<void>;
}

export const RegisterForm = ({ form, onSubmit }: RegisterFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96">
      <h1 className="font-bold text-4xl mb-3 text-primary">Create Account</h1>
      <p className="mb-10 font-medium text-gray-500">
        Register to join us 🚀
      </p>

      <Input
        {...register("username")}
        placeholder="Username"
        error={errors.username?.message}
      />

      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        error={errors.email?.message}
      />

      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        error={errors.password?.message}
      />

      <Input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
      />

      <Button 
        type="submit" 
        className="mt-10 mb-5"
        isLoading={isSubmitting}
      >
        SIGN UP
      </Button>

      <div className="flex mt-5">
        <span className="text-gray-500">Already have an account?</span>
        <Link 
          to={ROUTES.LOGIN} 
          className="text-blue-600 ml-1 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};
