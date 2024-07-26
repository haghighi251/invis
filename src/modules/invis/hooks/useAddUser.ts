"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "@/modules/shared/types/QueryKey";
import { queryClient } from "@/components/ReactQuery/ReactQueryProvider";
import { User } from "@/shared/types/invis/UserSchema";
import { useAddUserResult } from "@/modules/invis/types/useAddUser";
import { addUser } from "@/modules/invis/services/addUser";

export const useAddUser = (): useAddUserResult => {
  const [error, setError] = useState<string | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: (user: User) => addUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.UsersList] });
      setError(undefined);
    },
    onError: (error) => {
      setError(`Error with adding a new user: ${error}`);
    },
  });

  useEffect(() => {
    if (mutation.data?.success) {
      setError(undefined);
    } else setError(mutation.data?.error);
  }, [mutation.data?.success, mutation.data?.error]);

  const addUserMutation = (user: User) => {
    mutation.mutate(user);
  };

  return {
    addUserIsLoading: mutation.isPending,
    addUserIsError: mutation.isError || !!error,
    addUserIsSuccess: mutation.data?.success || false,
    error,
    addUserMutation,
  };
};
