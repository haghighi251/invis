import { z } from "zod";
import { UserSchema } from "@/shared/types/invis/UserSchema";

export const APIResponseSchema = z.object({
  success: z.boolean({
    message: "You have to add the success option in your result.",
  }),
  error: z.string().optional(),
  data: z.union([z.array(UserSchema), UserSchema, z.null()]),
});

export type APIResponse = z.infer<typeof APIResponseSchema>;
