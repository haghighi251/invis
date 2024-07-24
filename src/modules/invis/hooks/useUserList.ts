import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserResult } from "@/modules/invis/types/useUserResult";
import { User } from "@/shared/types/invis/UserSchema";
import { APIResponse } from "@/shared/types/APIResponse";
import { getUsers } from "@/modules/invis/services/getUsers";

export const useUserList = (): useUserResult => {
  const [users, setUsers] = useState<Array<User> | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const { isError, isLoading, data } = useQuery<APIResponse | undefined>({
    queryKey: ["UsersList"],
    queryFn: getUsers,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    if (!data) {
      setUsers(null);
      setError(
        "Something went wrong while fetching data from the server. Please refresh the page and try again."
      );
    } else if (data.success === true) {
      const res = data.data as Array<User>;
      setUsers(res);
      setError(undefined);
    } else {
      setUsers(null);
      setError(data.error);
    }
  }, [data, isError]);

  return {
    usersListIsLoading: isLoading,
    usersListIsError: isError,
    error,
    usersList: users,
  };
};
