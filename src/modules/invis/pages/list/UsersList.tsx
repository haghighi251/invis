"use client";
import React, { useEffect, useState } from "react";
import { useUserList } from "@modules/invis/hooks/useUserList";
import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import UsersListView from "@modules/invis/components/list/UsersListView";
import { AddNewUserModal } from "@/modules/invis/components/AddNewUserModal/AddNewUserModal";
import { HiSearch } from "react-icons/hi";

const UsersList = () => {
  const [openAddNewUserModal, setOpenAddNewUserModal] =
    useState<boolean>(false);
  const [newUserId, setNewUserId] = useState<number>(1);
  const { usersListIsLoading, usersListIsError, error, usersList } =
    useUserList();

  useEffect(() => {
    let userId;
    !usersList || usersList.length < 1 
    ? userId = 1 
    : userId = usersList.length + 1;
    setNewUserId(userId);
  }, [usersList]);

  return (
    <div className="flex flex-col w-3/4 items-center my-5 ">
      <TextInput type="text" className="w-1/2" icon={HiSearch} placeholder="name, username or email" required />
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
        Users list
      </h1>

      {usersListIsLoading && <Spinner aria-label="Loading ...." size="lg" />}
      {(usersListIsError || (!usersListIsLoading && !usersList && !!error)) && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{error}</span>
        </Alert>
      )}
      {!!usersList && <UsersListView users={usersList} />}
      <Button className="my-5" onClick={() => setOpenAddNewUserModal(true)}>Add new user</Button>
      <AddNewUserModal
        openModal={openAddNewUserModal}
        setOpenModal={setOpenAddNewUserModal}
        lastUserId={newUserId}
      />
    </div>
  );
};

export default UsersList;
