"use client";
import React from "react";
import { useUserList } from "@modules/invis/hooks/useUserList";
import { Alert, Spinner } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import UsersListView from "../../components/list/UsersListView";

const UsersList = () => {
  const { usersListIsLoading, usersListIsError, error, usersList } =
    useUserList();

  return (
    <div>
      <h1 className="my-3">Users list:</h1>
      
      {usersListIsLoading && <Spinner aria-label="Loading ...." size="lg" />}
      {usersListIsError && (
        <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">{error}</span>
      </Alert>
      )}
      {!!usersList && <UsersListView users={usersList} />}
    </div>
  );
};

export default UsersList;
