import { z } from "zod";

export const GetUsersSchema = z.object({

});

export type GetUsers = z.infer<typeof GetUsersSchema>;