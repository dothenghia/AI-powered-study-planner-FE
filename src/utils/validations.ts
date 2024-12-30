import * as yup from "yup";
import regex from "./regex";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(regex.number, "Must contain at least 1 number")
    .matches(regex.lowerCase, "Must contain at least 1 lowercase letter")
    .matches(regex.upperCase, "Must contain at least 1 uppercase letter")
    .matches(regex.specialCharacter, "Must contain at least 1 special character"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match")
});

export const taskSchema = yup.object({
  name: yup.string().required("Task name is required"),
  description: yup.string(),
  priority: yup.string().oneOf(["High", "Medium", "Low"]).required(),
  status: yup.string().oneOf(["Todo", "In Progress", "Completed", "Expired"]).required(),
  opened_at: yup.string().required("Start date is required"),
  dued_at: yup.string().required("Due date is required")
}); 