import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { ResetPassword } from "../../types/auth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ResetPasswordFormProps {
  form: UseFormReturn<ResetPassword>;
  onSubmit: (data: ResetPassword) => Promise<void>;
}

export const ResetPasswordForm = ({ form, onSubmit }: ResetPasswordFormProps) => {
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
      <h1 className="font-bold text-4xl mb-3 text-primary">Reset Password</h1>
      <p className="mb-20 font-medium text-gray-500">Please enter your new password</p>

      <Input
        {...register("password")}
        type="password"
        placeholder="New password"
        error={errors.password?.message}
      />
      <div className="mb-5"></div>

      <Input
        {...register("confirmPassword")}
        type="password"
        placeholder="Confirm password"
        error={errors.confirmPassword?.message}
      />
      <div className="mb-5"></div>

      <Link
        to="/login"
        className="text-blue-600 mt-2 ml-1 hover:underline text-right"
      >
        Back to login
      </Link>

      <Button type="submit" className="mt-10 mb-5">
        Create password
      </Button>
    </form>
  );
};
