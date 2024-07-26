import { axiosClient } from "@/infrastructure/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";
import { User, UserSchema } from "@/shared/types/invis/UserSchema";
import { ZodError } from "zod";
export const addUser = async (
  user:User
): Promise<APIResponse | undefined> => {
  try {
    UserSchema.parse(user);
    return axiosClient.post(`/api/invis/users/add`, user);
  } catch (error) {
    if (error instanceof ZodError)
      throw new Error(error.errors[0].message);

    throw new Error("Unexpected error with addUser API caller.");
  }
};
