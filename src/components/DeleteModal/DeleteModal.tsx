"use client";

import { UserMessages } from "@/modules/shared/types/UserMessages";
import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export type DeleteModalProps = {
  userId: number;
  show: boolean;
};

export function DeleteModalComponent({ userId, show }: DeleteModalProps) {
  const [openModal, setOpenModal] = useState(true);

  useEffect(() => {
    setOpenModal(show);
  }, [show]);

  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {UserMessages.DELETE_USER_MESSAGE}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={() => setOpenModal(false)}>
              {UserMessages.CONFIRM_MESSAGE}
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              {UserMessages.CANCELATION_MESSAGE}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
