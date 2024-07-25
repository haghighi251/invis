"use client";
import { DeleteModalComponent } from "@/components/DeleteModal/DeleteModal";
import { UserMessages } from "@/modules/shared/types/UserMessages";
import { User } from "@/shared/types/invis/UserSchema";
import { Alert, Avatar, Button } from "flowbite-react";
import React, { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

export type UserViewProps = {
  user: User | null;
};

const UserView = ({ user }: UserViewProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  if (!user)
    return (
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">
          {UserMessages.INVALID_USER_DATA_ERROR}
        </span>
      </Alert>
    );

  return (
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
      <div className="flex gap-3">
        <Button size="md" onClick={() => setOpenModal(true)}>
          Delete
        </Button>
      </div>
      <DeleteModalComponent userId={user.id} show={openModal} />
    </div>
  );
};

export default UserView;
