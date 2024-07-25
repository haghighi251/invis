import { User } from "@/shared/types/invis/UserSchema";
import { Alert, Avatar, List } from "flowbite-react";
import React from "react";
import { HiInformationCircle } from "react-icons/hi";

export type UsersListViewProps = {
  users: Array<User>;
};

const UsersListView = ({ users }: UsersListViewProps) => {
  if (users.length < 1)
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">There is no user to be shown.</span>
      </Alert>
    );
  return users.map((user) => {
    return (
      <List
        key={user.id}
        className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
      >
        <List.Item className="pb-3 sm:pb-4 list-none">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar
              img={`/profiles/profile-picture-${user.id}.jpg`}
              alt={user.name}
              rounded
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
              </p>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {user.email}
              </p>
            </div>
          </div>
        </List.Item>
      </List>
    );
  });
};

export default UsersListView;
