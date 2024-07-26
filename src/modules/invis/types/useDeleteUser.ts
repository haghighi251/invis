export type useDeleteUserResult = {
  deleteUserIsLoading: boolean;
  deleteUserIsError: boolean;
  deleteUserIsSuccess: boolean;
  error: string | undefined;
  deleteUser: () => void;
};
