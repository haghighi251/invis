import { z } from "zod";

export const UserSchema = z.object({
  id: z
    .number({ message: "ID must be a number" })
    .int({ message: "ID must be an integer" })
    .positive({ message: "ID must be a positive integer" }),
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  profileImage: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
