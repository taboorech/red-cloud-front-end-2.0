import { z as zod } from "zod";

const email = zod.email("Invalid email address");

const password = zod.string().min(2, "Password must be at least 6 characters");

export const loginSchema = zod.object({
  email,
  password,
  rememberMe: zod.boolean().default(false),
});

export const registrationSchema = zod
  .object({
    email,
    username: zod.string().min(1, "Username is required"),
    login: zod.string().min(1, "Login is required"),
    phone: zod.string().min(1, "Phone number is required"),
    password,
    confirmPassword: zod.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = zod.object({
  email,
});

export const resetPasswordSchema = zod
  .object({
    password,
    confirmPassword: zod.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginSchemaType = zod.infer<typeof loginSchema>;
export type RegistrationSchemaType = zod.infer<typeof registrationSchema>;
export type ForgotPasswordSchemaType = zod.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchemaType = zod.infer<typeof resetPasswordSchema>;
