import { z } from "zod";

export const createSignInSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("error_email_invalid")),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        t("error_password_combined")
      ),
  });
};

export const createSignUpSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().email(t("error_email_invalid")),

      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
          t("error_password_combined")
        ),

      confirm_password: z.string(),

      first_name: z.string().min(1, t("error_required")),

      last_name: z.string().min(1, t("error_required")),

      phone: z.string().regex(/^[0-9]{9,11}$/, t("error_phone_invalid")),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: t("error_password_not_match"),
    });

export const createEmailSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("error_email_invalid")),
  });

export const createPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      new_password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
          t("error_password_combined")
        ),
      confirm_password: z.string(),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("error_password_not_match"),
      path: ["confirm_password"],
    });

export type EmailFormData = z.infer<ReturnType<typeof createEmailSchema>>;
export type PasswordFormData = z.infer<ReturnType<typeof createPasswordSchema>>;

export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>;
export type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;
