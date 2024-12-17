import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import regex from "../utils/regex";
import { useEffect, useState } from "react";
import illustration from "../assets/login.png";
import useMsgStore from "../stores/msgStore";

type ICreateUserData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  username: yup
    .string()
    .required("Username field is required.")
    .min(3, "Username must be at least 3 characters long."),
  email: yup
    .string()
    .required("Email field is required.")
    .email("Please enter a valid e-mail."),
  password: yup
    .string()
    .required("Password field is required.")
    .min(8, "Enter a password of at least 8 characters.")
    .matches(regex.number, "Enter at least 1 number.")
    .matches(regex.lowerCase, "Enter at least 1 lowercase character.")
    .matches(regex.upperCase, "Enter at least 1 uppercase character.")
    .matches(regex.specialCharacter, "Enter at least 1 special character."),
  confirmPassword: yup
    .string()
    .required("The confirm password field is required.")
    .oneOf([yup.ref("password")], "Passwords are not the same."),
});

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setMsg } = useMsgStore();

  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<ICreateUserData>({ resolver: yupResolver(schema) });

  const handleSubmit = async (data: ICreateUserData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error details
        throw new Error(errorData.message || "Network response was not ok");
      }

      setMsg("Account created successfully!", false);
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      console.error("Error:", error);
    }
  };

  const onHandleSubmit = () => {
    // console.log("Click");
  };

  useEffect(() => {
    setMsg("", false);
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh] justify-center items-center">
      <img
        src={illustration}
        alt="left-financial"
        className=" bg-cover w-[40vw] h-[80vh] object-cover"
      />
      <div className="flex flex-col w-[40vw] h-[80vh] bg-white justify-center items-center">
        <form
          onSubmit={onSubmit(handleSubmit)}
          className="flex flex-col justify-center outline-none"
        >
          <h1 className="font-bold text-left text-4xl mb-3 text-[#0C0667]">
            Create Account
          </h1>
          <p className="mb-10 font-medium text-gray-500">
            Register to join us 🚀
          </p>
          {error && <span className="text-red-500 mb-4">{error}</span>}
          
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className={
              errors.username
                ? "block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32] focus:ring-1 focus:ring-[#C93B32]"
                : "block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"
            }
          />
          <span className="place-self-start text-[14px] text-[#C93B32]">
            {errors.username?.message}
          </span>

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className={
              errors.email
                ? "block peer rounded-[5px] w-[25rem]  mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32] focus:ring-1 focus:ring-[#C93B32]"
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
                ? "block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32] focus:ring-1 focus:ring-[#C93B32]"
                : "block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"
            }
          />
          <span className="place-self-start text-[14px] text-[#C93B32]">
            {errors.password?.message}
          </span>

          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm password"
            className={
              errors.confirmPassword
                ? "block peer rounded-[5px] w-[25rem] mt-5 border-[#C93B32] focus:outline-none focus:border-[#C93B32] focus:ring-1 focus:ring-[#C93B32]"
                : "block peer rounded-[5px] border-[#AEBBCD] w-[25rem] mt-5 focus:outline-none focus:ring-1"
            }
          />
          <span className="place-self-start text-[14px] text-[#C93B32]">
            {errors.confirmPassword?.message}
          </span>

          <button
            type="submit"
            className={`rounded-md bg-[#362DD2] text-white w-[25rem] p-3 mt-10 hover:bg-[#1A0F9A] mb-5`}
            onClick={onHandleSubmit}
          >
            SIGN UP
          </button>
          <div className="flex mt-5">
            <span className="text-gray-500">Already have an account?</span>
            <Link to="/login" className="hover:text-[#2347C5] hover:underline">
              <p className="text-[#5473E3] ms-1 font-medium mb-5">Sign in</p>
            </Link>
          </div>
        </form>

        {/* <div className="text-[#6D7989] w-[25rem]">
          <label className="text-[#404B5A]">
            Password must meet these requirements:
          </label>
          <div className="mt-2 ">
            <img
              src={passwordRequirements.minLength ? checkGreen : notRed}
              className="inline-block mr-2"
            />
            <p className="inline-block">
              Enter a password of at least 8 characters;
            </p>
          </div>
          <div>
            <img
              src={passwordRequirements.hasNumber ? checkGreen : notRed}
              className="inline-block mr-2"
            />
            <p className="inline-block">Enter at least 1 number;</p>
          </div>
          <div>
            <img
              src={passwordRequirements.hasLower ? checkGreen : notRed}
              className="inline-block mr-2"
            />
            <p className="inline-block">
              Enter at least 1 lowercase character;
            </p>
          </div>
          <div>
            <img
              src={passwordRequirements.hasUpper ? checkGreen : notRed}
              className="inline-block mr-2"
            />
            <p className="inline-block">
              Enter at least 1 uppercase character;
            </p>
          </div>
          <div>
            <img
              src={passwordRequirements.hasSpecial ? checkGreen : notRed}
              className="inline-block mr-2"
            />
            <p className="inline-block">Enter at least 1 special character.</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
