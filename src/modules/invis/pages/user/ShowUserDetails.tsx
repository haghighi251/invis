"use client";
import React from "react";
import { useUserDetails } from "@/modules/invis/hooks/useUserDetails";
import { Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import UserView from "@/modules/invis/components/details/UserView";

export type ShowUserDetailsProps = {
  userId: number;
};

const ShowUserDetails = ({ userId }: ShowUserDetailsProps) => {
  const { userDetailsIsLoading, userDetailsIsError, error, user } =
    useUserDetails({ userId });

  return (
    <div className="flex flex-col w-3/4 items-center">
      <h1 className="my-5">User Details:</h1>

      {userDetailsIsLoading && <Spinner aria-label="Loading ...." size="lg" />}
      {userDetailsIsError && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{error}</span>
        </Alert>
      )}
      {!!user && <UserView user={user} />}
    </div>
  );
};

export default ShowUserDetails;
