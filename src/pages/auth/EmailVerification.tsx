import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeJwt, isTokenExpired } from "../../utils/jwt";
import { ROUTES } from "../../constants/constants";
import { BackgroundBase } from "../../components/BackgroundBase";
import illustration from "../../assets/login.png";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const { verifyEmail, isLoading } = useAuth();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token") || "";
      
      if (urlToken) {
        const decoded = decodeJwt(urlToken);
        console.log('Decoded token:', decoded);
        
        if (!decoded) {
          toast.error("Invalid verification token");
          navigate(ROUTES.LOGIN);
          return;
        }

        if (isTokenExpired(urlToken)) {
          toast.error("Verification token has expired");
          navigate(ROUTES.LOGIN);
          return;
        }

        try {
          const success = await verifyEmail(urlToken);
          if (success) {
            setIsVerified(true);
            toast.success("Email verified successfully!");
          }
        } catch (error) {
          toast.error("Failed to verify email");
          navigate(ROUTES.LOGIN);
        }
      } else {
        toast.error("No verification token provided");
        navigate(ROUTES.LOGIN);
      }
    };

    verifyToken();
  }, []);

  return (
    <>
      <BackgroundBase />
      <div className="relative z-10 flex w-full h-screen justify-center items-center">
        <img
          src={illustration}
          alt="verification-illustration"
          className="w-2/5 h-4/5 object-cover my-auto"
        />
        <div className="flex flex-col w-2/5 h-4/5 bg-white my-auto justify-center items-center">
          <div className="text-center px-8">
            {isLoading ? (
              <>
                <h1 className="font-bold text-4xl mb-3 text-primary">Verifying Email...</h1>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <p className="mt-5 text-gray-600">
                  Please wait while we verify your email address.
                </p>
              </>
            ) : isVerified ? (
              <>
                <h1 className="font-bold text-4xl mb-3 text-primary">Email Verified! 🎉</h1>
                <p className="mb-10 text-xl font-medium text-gray-500">
                  Your email has been successfully verified.
                </p>
                <p className="mb-10 text-gray-600">
                  You can now proceed to login and start using your account.
                </p>
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="mt-5 px-8"
                >
                  Go to Login
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
