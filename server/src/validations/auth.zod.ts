import z from "zod";

const LoginBodySchema = z.object({
    username: z.string(),
    password: z.string(),
});

const RegisterBodySchema = z.object({
    username: z
        .string()
        .min(4, "Username must be at least 4 characters long")
    , email: z
        .string()
        .email("Invalid email address")
    , password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long")
});

const ResetPasswordSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
    , newPassword: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password must be at most 100 characters long")
    ,
    currentPassword: z
        .string()
        .min(6, "Current password must be at least 6 characters long")
        .max(100, "Current password must be at most 100 characters long")
});

const VerifyEmailSchema = z.object({
    email: z
        .string()
        .email("Invalid email address"),
    verificationCode: z.string().min(6, "Verification code must be at least 6 characters long"),
});

export {
    LoginBodySchema,
    RegisterBodySchema,
    ResetPasswordSchema,
    VerifyEmailSchema,
};
