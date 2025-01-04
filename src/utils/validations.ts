import * as yup from "yup";
import regex from "./regex";
import { STATUS, PRIORITY } from "../types/common";

// Login schema with yup validation
export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
});

// Register schema with yup validation
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

// Task schema with yup validation
export const taskSchema = yup.object({
  name: yup.string().required("Task name is required"),
  description: yup.string(),
  priority: yup.string().oneOf(Object.values(PRIORITY)).required(),
  status: yup.string().oneOf(Object.values(STATUS)).required(),
  estimated_time: yup
    .number()
    .typeError("Estimated time must be a number")
    .required("Estimated time is required")
    .integer("Estimated time must be an integer")
    .min(1, "Estimated time must be at least 1 minute")
    .max(1440, "Estimated time cannot exceed 1440 minutes (24 hours)"),
  opened_at: yup
    .string()
    .required("Start date is required")
    .test("opened_at", "Start date cannot be after due date", function(opened_at) {
      const { dued_at } = this.parent;
      if (!opened_at || !dued_at) return true;
      return new Date(opened_at) <= new Date(dued_at);
    }),
  dued_at: yup
    .string()
    .required("Due date is required")
    .test("dued_at", "Due date cannot be before start date", function(dued_at) {
      const { opened_at } = this.parent;
      if (!opened_at || !dued_at) return true;
      return new Date(dued_at) >= new Date(opened_at);
    })
}); 