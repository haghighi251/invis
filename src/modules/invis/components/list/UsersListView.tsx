import { User } from "@/shared/types/invis/UserSchema";
import { Alert, Avatar, List, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import React from "react";
import { HiInformationCircle } from "react-icons/hi";

export type UsersListViewProps = {
  users: Array<User>;
};

const UsersListView = ({ users }: UsersListViewProps) => {
  const router = useRouter();

  const openUserView = (userId: number) => {
    router.push(`/user/${userId}`);
  };

  const randomImage = (): number => {
    return Math.floor(Math.random() * 5) + 1;
  }

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
                onClick={() => openUserView(user.id)}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="flex flex-wrap items-left gap-2">
                    <Avatar
                      img={`/profiles/profile-picture-${randomImage()}.jpg`}
                      alt={user.name}
                      rounded
                      size="lg"
                      className="items-left pl-0"
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default UsersListView;
