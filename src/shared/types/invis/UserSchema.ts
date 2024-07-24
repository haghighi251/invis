import { z } from "zod";

export const UserSchema = z.object({
  id: z
    .number()
    .nonnegative()
    .int()
    .refine((val) => val > 0, {
      message: "ID must be a positive integer",
    }),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
});

export type User = z.infer<typeof UserSchema>;
