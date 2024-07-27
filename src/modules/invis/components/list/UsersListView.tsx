import { User } from "@/shared/types/invis/UserSchema";
import { Alert, Avatar, Button, List, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { UpdateUserModal } from "../UpdateUserModal/UpdateUserModal";

export type UsersListViewProps = {
  users: Array<User>;
};

const UsersListView = ({ users }: UsersListViewProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const openUserView = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  const setUserToUpdate = (userId: number) => {
    const user = users.find( user => user.id === userId);
    if(user) setSelectedUser(user);
  };

  useEffect(() => {
    setOpenModal(true);
  }, [selectedUser]);

  useEffect(() => {
    !openModal && setSelectedUser(null);
  }, [openModal]);

  if (users.length < 1)
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">There is no user to be shown.</span>
      </Alert>
    );

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Profile</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>UserName</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user) => {
            return (
              <Table.Row
                key={user.id}
                data-testid={`user${user.id}`}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex flex-wrap items-left gap-2">
                    <Avatar
                      img={`/profiles/profile-picture-${user.id > 4 ? 5 : user.id}.jpg`}
                      alt={user.name}
                      rounded
                      size="lg"
                      className="items-left pl-0 cursor-pointer"
                      onClick={() => openUserView(user.id)}
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => setUserToUpdate(user.id)}>Edit</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
          <UpdateUserModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            user={selectedUser}
          />
        </Table.Body>
      </Table>
    </div>
  );
};

export default UsersListView;
