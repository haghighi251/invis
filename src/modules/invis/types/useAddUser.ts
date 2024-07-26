import { User } from "@/shared/types/invis/UserSchema";

export type useAddUserResult = {
  addUserIsLoading: boolean;
  addUserIsError: boolean;
  addUserIsSuccess: boolean;
  error: string | undefined;
  addUserMutation: (user: User) => void;
};
