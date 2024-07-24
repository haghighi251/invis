import { User } from "@/shared/types/invis/UserSchema";

export type useUserResult = {
  usersListIsLoading: boolean;
  usersListIsError: boolean;
  error: string | undefined;
  usersList: Array<User> | null;
};
