"use client";
import React, { useEffect, useState } from "react";
import { useUserList } from "@modules/invis/hooks/useUserList";
import { Alert, Button, Pagination, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import UsersListView from "@modules/invis/components/list/UsersListView";
import { AddNewUserModal } from "@/modules/invis/components/AddNewUserModal/AddNewUserModal";
import { HiSearch } from "react-icons/hi";
import { User } from "@/shared/types/invis/UserSchema";

const UsersList = () => {
  const [users, setUsers] = useState<Array<User> | null>(null);
  const [search, setSearch] = useState<string>("");
  const [openAddNewUserModal, setOpenAddNewUserModal] =
    useState<boolean>(false);
  const [newUserId, setNewUserId] = useState<number>(1);
  const { usersListIsLoading, usersListIsError, error, usersList } =
    useUserList();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<Array<User>>([]);
  const USERS_PER_PAGE = 2;

  useEffect(() => {
    setUsers(usersList);

    let userId;
    !usersList || usersList.length < 1
      ? (userId = 1)
      : (userId = usersList.length + 1);
    setNewUserId(userId);
  }, [usersList]);

  useEffect(() => {
    if (!usersList) return;

    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      const searchedUsers = usersList.filter(({ name, email, username }) => {
        return (
          name.toLowerCase().startsWith(lowerCaseSearch) ||
          email.toLowerCase().startsWith(lowerCaseSearch) ||
          username.toLowerCase().startsWith(lowerCaseSearch)
        );
      });

      setUsers(searchedUsers);
    } else {
      setUsers(usersList);
    }
  }, [search, usersList]);

  useEffect(() => {
    if (users) {
      const startIdx = (currentPage - 1) * USERS_PER_PAGE;
      const endIdx = startIdx + USERS_PER_PAGE;
      setFilteredUsers(users.slice(startIdx, endIdx));
    }
  }, [users, currentPage]);

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex flex-col w-3/4 items-center my-5 ">
      <div className="w-full flex gap-4 justify-center items-center">
        <div className="">
          <TextInput
            type="text"
            icon={HiSearch}
            placeholder="name, username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </div>
        <Button onClick={() => setOpenAddNewUserModal(true)}>
          Add new user
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
        Users list
      </h1>

      {usersListIsLoading && <Spinner aria-label="Loading ...." size="lg" />}
      {(usersListIsError || (!usersListIsLoading && !usersList && !!error)) && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{error}</span>
        </Alert>
      )}
      {!!filteredUsers && <UsersListView users={filteredUsers} />}
      <div className="flex overflow-x-auto sm:justify-center my-5">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil((users?.length || 0) / USERS_PER_PAGE)}
          onPageChange={onPageChange}
        />
      </div>
      <AddNewUserModal
        openModal={openAddNewUserModal}
        setOpenModal={setOpenAddNewUserModal}
        lastUserId={newUserId}
      />
    </div>
  );
};

export default UsersList;
