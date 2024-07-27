import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  profileImage: z.string().optional(),
});

export const PartialUserSchema = UserSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
      path: [],
    }
  );

export type User = z.infer<typeof UserSchema>;
export type PartialUser = z.infer<typeof PartialUserSchema>;
