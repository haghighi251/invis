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
    return axiosClient.get(`/api/invis/user/${userId}`);
  } catch (error) {
    if (error instanceof ZodError)
      return {
        success: false,
        error: error.errors[0].message,
        data: null,
      };

    return undefined;
  }
};
