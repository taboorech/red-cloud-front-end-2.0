import { z as zod } from "zod";

export const profileEditSchema = zod
  .object({
    username: zod.string().min(1, "Username is required"),
    currentPassword: zod.string().optional(),
    newPassword: zod.string().optional(),
    confirmPassword: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.newPassword) return;

    if (!data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Required to change password",
        path: ["currentPassword"],
      });
    }

    if (data.newPassword.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "Min 6 characters",
        path: ["newPassword"],
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords match error",
        path: ["confirmPassword"],
      });
    }
  });

export type ProfileEditSchemaType = zod.infer<typeof profileEditSchema>;
