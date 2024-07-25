import { User } from "@/shared/types/invis/UserSchema";

export type UserDetailsResult = {
  userDetailsIsLoading: boolean;
  userDetailsIsError: boolean;
  error: string | undefined;
  user: User | null;
};
