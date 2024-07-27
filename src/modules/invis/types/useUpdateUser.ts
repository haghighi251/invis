import { User } from '@/shared/types/invis/UpdateUserSchema';

export type useUpdateUserResult = {
  updateUserIsLoading: boolean;
  updateUserIsError: boolean;
  updateUserIsSuccess: boolean;
  error: string | undefined;
  updateUserMutation: (userId: number, user: User) => void;
};
