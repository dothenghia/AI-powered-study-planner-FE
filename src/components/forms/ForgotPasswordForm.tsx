import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPassword } from "../../types/auth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotPassword>;
  onSubmit: (data: ForgotPassword) => Promise<void>;
}

export const ForgotPasswordForm = ({ form, onSubmit }: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-96"
    >
      <h1 className="font-bold text-4xl mb-3 text-primary">Forgot Password?</h1>
      <p className="mb-20 font-medium text-gray-500">Please enter your email</p>

      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        error={errors.email?.message}
      />
      <div className="mb-5"></div>

      <Link
        to="/login"
        className="text-blue-600 mt-2 ml-1 hover:underline text-right"
      >
        Back to login
      </Link>

      <Button type="submit" className="mt-10 mb-5">
        Send email
      </Button>
    </form>
  );
};
