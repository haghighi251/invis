import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/shared/types/invis/UserSchema";
import { APIResponse } from "@/shared/types/APIResponse";
import { UserDetailsResult } from "@/modules/invis/types/useUserDetails";
import { QueryKey } from "@/modules/shared/types/QueryKey";
import { getUserDetails } from "@/modules/invis/services/getUserDetails";
import { UserMessages } from "@/modules/shared/types/UserMessages";

export type useUserDetailsProps = {
  userId: number;
};

export const useUserDetails = ({
  userId,
}: useUserDetailsProps): UserDetailsResult => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const { isError, isLoading, data } = useQuery<APIResponse | undefined>({
    queryKey: [QueryKey.UserView],
    queryFn: () => getUserDetails(userId),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    if (!data) {
      setUser(null);
      setError(UserMessages.SERVER_UNKNOWN_ERROR);
    } else if (data.success === true) {
      const res = data.data as User;
      setUser(res);
      setError(undefined);
    } else {
      setUser(null);
      setError(data.error);
    }
  }, [data, isError]);

  return {
    userDetailsIsLoading: isLoading,
    userDetailsIsError: isError,
    error,
    user,
  };
};
