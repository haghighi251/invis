"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "@/modules/shared/types/QueryKey";
import { queryClient } from "@/components/ReactQuery/ReactQueryProvider";
import { useUpdateUserResult } from "@/modules/invis/types/useUpdateUser";
import { updateUser } from "@/modules/invis/services/updateUser";
import { User } from '@/shared/types/invis/UpdateUserSchema';

export const useUpdateUser = (): useUpdateUserResult => {
  const [error, setError] = useState<string | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: (req: {userId: number, user: User}) => updateUser(req.userId, req.user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.UsersList] });
      setError(undefined);
    },
    onError: (error) => {
      setError(`Error with updating a user: ${error}`);
    },
  });

  useEffect(() => {
    if (mutation.data?.success) {
      setError(undefined);
    } else setError(mutation.data?.error);
  }, [mutation.data?.success, mutation.data?.error]);

  const updateUserMutation = (userId: number, user: User) => {
    mutation.mutate({userId, user});
  };

  return {
    updateUserIsLoading: mutation.isPending,
    updateUserIsError: mutation.isError || !!error,
    updateUserIsSuccess: mutation.data?.success || false,
    error,
    updateUserMutation,
  };
};
