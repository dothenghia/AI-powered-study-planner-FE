import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import illustration from "../assets/login.png";
import * as yup from "yup";
import useMsgStore from "../stores/msgStore";
import { useLogin } from "../hooks/useLogin";
import { useEffect } from "react";
import useAuthStore from "../stores/authStore";

type ICreateUserData = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup
    .string()
    .required("Email field is required.")
    .email("Please enter a valid e-mail."),
  password: yup.string().required("Password field is required."),
});

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useLogin();
  const { msg, isError, setMsg } = useMsgStore();
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<ICreateUserData>({ resolver: yupResolver(schema) });

  const handleSubmit = async (data: any) => {
    try {
      await login(data);
      navigate("/profile");
    } catch (error) {
      if (error instanceof Error) setMsg(error.message, true);
    }
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const onHandleSubmit = () => {
    // console.log("Click");
  };

  const onGoogleSignIn = () => {
    window.location.href = `${apiUrl}/google`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    const email = params.get("email");
    if (token) {
      setUser(email, username, token);
      navigate("/profile");
    }
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh] justify-center items-center">
      <img
        src={illustration}
        alt="left-financial"
        className=" bg-cover w-[40vw] h-[80vh] object-cover"
      />
      <div className="flex w-[40vw] h-[80vh] bg-white justify-center items-center">
        <form
          onSubmit={onSubmit(handleSubmit)}
          className="flex flex-col justify-center outline-none"
        >
          <h1 className="font-bold text-left text-4xl mb-3 text-[#0C0667]">
            Welcome Back
          </h1>
          <p className="mb-20 font-medium text-gray-500">
            Sign in to continue the journey 🚀
          </p>
          {msg && (
            <span
              className={`${isError ? "text-red-500" : "text-green-500"} mb-4`}
            >
              {msg}
            </span>
          )}
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className={
              errors.email
                ? "block peer rounded-[5px] w-[25rem]  mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]"
                : "block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"
            }
          />
          <span className="place-self-start text-[14px] text-[#C93B32]">
            {errors.email?.message}
          </span>

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className={
              errors.password
                ? "block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32]  focus:ring-1 focus:ring-[#C93B32]"
                : "block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"
            }
          />
          <span className="place-self-start text-[14px] text-[#C93B32]">
            {errors.password?.message}
          </span>

          <button
            type="submit"
            className={`rounded-md bg-[#362DD2] text-white w-[25rem] p-3 mt-10 hover:bg-[#1A0F9A] mb-5`}
            onClick={onHandleSubmit}
          >
            LOG IN
          </button>
          <div className="flex mt-5">
            <span className="text-gray-500">Don't have an account?</span>
            <Link to="/register" className="hover:underline">
              <p className="text-[#5473E3] ms-1 font-medium mb-5">Sign up</p>
            </Link>
          </div>
          <div className="px-6 sm:px-0 w-full">
            <button
              type="button"
              onClick={onGoogleSignIn}
              style={{width: '100%'}}
              className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-md text-sm px-5 py-3 text-center inline-flex items-center justify-between"
            >
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign in with Google<div></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
