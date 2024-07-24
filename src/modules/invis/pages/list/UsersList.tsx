"use client";
import React from "react";
import { useUserList } from "@modules/invis/hooks/useUserList";

const UsersList = () => {
  const { usersListIsLoading, usersListIsError, error, usersList } =
    useUserList();

  return (
    <div>
      <h1>Users list:</h1>
      {usersListIsLoading && <>Loading ....</>}
      {usersListIsError && <>{error}</>}
      {!!usersList &&
        usersList.map((user) => {
          return (
            <p key={user.id}>
              <b>Username:</b> {user.username}
              <b className="ml-5">Email:</b> {user.email}
            </p>
          );
        })}
    </div>
  );
};

export default UsersList;
