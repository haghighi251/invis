import { axiosClient } from "@/infrastructure/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";
import { UserSchema } from "@/shared/types/invis/UserSchema";
import { ZodError } from "zod";

export const UserIDSchema = UserSchema.shape.id;

export const getUserDetails = async (
  userId: number
): Promise<APIResponse | undefined> => {
  try {
    UserIDSchema.parse(userId);
    return axiosClient.get(`/api/invis/users/${userId}`);
  } catch (error) {
    if (error instanceof ZodError)
      throw new Error(error.errors[0].message);

    throw new Error("Unexpected error with getUserDetails API caller.");
  }
};
