import { axiosClient } from "@/shared/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";

export const getUsers = (): Promise<APIResponse | undefined> => {
  return axiosClient.get("/api/invis/users");
};
