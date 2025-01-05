import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoginCredentials } from "../../types/auth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface LoginFormProps {
  form: UseFormReturn<LoginCredentials>;
  onSubmit: (data: LoginCredentials) => Promise<void>;
  onGoogleSignIn: () => void;
}

export const LoginForm = ({
  form,
  onSubmit,
  onGoogleSignIn,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96">
      <h1 className="font-bold text-4xl mb-3 text-primary">Welcome Back</h1>
      <p className="mb-20 font-medium text-gray-500">
        Sign in to continue the journey 🚀
      </p>

      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        error={errors.email?.message}
      />
      <div className="mb-5"></div>

      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        error={errors.password?.message}
      />
      <Link
        to="/forgot-password"
        className="text-blue-600 mt-2 ml-1 hover:underline text-right"
      >
        Forgot password ?
      </Link>
      <div className="mb-5"></div>

      <Button type="submit" variant="primary" className="mt-10 mb-5">
        LOG IN
      </Button>

      <div className="flex mt-5">
        <span className="text-gray-500">Don't have an account?</span>
        <Link to="/register" className="text-blue-600 ml-1 hover:underline">
          Sign up
        </Link>
      </div>

      <Button
        type="button"
        onClick={onGoogleSignIn}
        variant="default"
        className="mt-5 gap-5 p-5"
      >
        <img
          width="20"
          height="20"
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
        Continue with Google
      </Button>
    </form>
  );
};
