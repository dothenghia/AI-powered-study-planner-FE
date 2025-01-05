import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { resetPasswordSchema } from "../../utils/validations";
import { ResetPasswordForm } from "../../components/forms/ResetPasswordForm";
import illustration from "../../assets/login.png";
import { BackgroundBase } from "../../components/BackgroundBase";
import { ROUTES } from "../../constants/constants";
import { ResetPassword } from "../../types/auth";
import { useEffect, useState } from "react";
import { decodeJwt, isTokenExpired } from "../../utils/jwt";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');

  const form = useForm<ResetPassword>({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token") || "";
    setToken(urlToken);
    
    if (urlToken) {
      const decoded = decodeJwt(urlToken);
      console.log('Decoded token:', decoded);
      
      if (!decoded) {
        toast.error("Invalid reset token");
        navigate(ROUTES.LOGIN);
        return;
      }

      if (isTokenExpired(urlToken)) {
        toast.error("Reset token has expired");
        navigate(ROUTES.LOGIN);
        return;
      }

      const decodedUserId = decoded.userId;
      if (!decodedUserId) {
        toast.error("Invalid reset token");
        navigate(ROUTES.LOGIN);
        return;
      }

      setUserId(decodedUserId);
    } else {
      toast.error("No reset token provided");
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  // Handle form submission
  const onSubmit = async (data: ResetPassword) => {
    const { password, confirmPassword } = data;
    console.log(password, confirmPassword);

    if (confirmPassword === password) {
      const success = await resetPassword(userId, password, token);
      if (success) {
        toast.success("Password reset successful");
        navigate(ROUTES.LOGIN);
      }
    }
  };

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
          <ResetPasswordForm
            form={form}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  );
}
