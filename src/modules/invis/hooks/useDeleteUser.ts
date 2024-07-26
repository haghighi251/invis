"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { QueryKey } from "@/modules/shared/types/QueryKey";
import { deleteUser } from "@/modules/invis/services/deleteUser";
import { useDeleteUserResult } from "@/modules/invis/types/useDeleteUser";
import { queryClient } from "@/components/ReactQuery/ReactQueryProvider";

export type useDeleteUserProps = {
  userId: number;
};

export const useDeleteUser = ({
  userId,
}: useDeleteUserProps): useDeleteUserResult => {
  const [error, setError] = useState<string | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: () => deleteUser(Number(userId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.UsersList] });
      setError(undefined);
    },
    onError: (error) => {
      setError(`Error deleting user: ${error}`);
    },
  });

  useEffect(() => {
    if (mutation.data?.success) {
      setError(undefined);
    } else setError(mutation.data?.error);
  }, [mutation.data?.success, mutation.data?.error]);

  return {
    deleteUserIsLoading: mutation.isPending,
    deleteUserIsError: mutation.isError || !!error,
    deleteUserIsSuccess: mutation.data?.success || false,
    error,
    deleteUser: () => mutation.mutate(),
  };
};
