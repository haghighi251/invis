import { axiosClient } from "@/infrastructure/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";
import { PartialUserSchema, User } from "@/shared/types/invis/UpdateUserSchema";
import { UserSchema } from "@/shared/types/invis/UserSchema";
import { ZodError } from "zod";

const userIdSchema = UserSchema.shape.id;

export const updateUser = async (
  userId: number,
  user: User
): Promise<APIResponse | undefined> => {
  try {
    userIdSchema.parse(Number(userId));
    PartialUserSchema.parse(user);
    return axiosClient.patch(`/api/invis/users/update/${userId}`, user);
  } catch (error) {
    if (error instanceof ZodError)
      throw new Error(error.errors[0].message);

    throw new Error("Unexpected error with updateUser API caller.");
  }
};
