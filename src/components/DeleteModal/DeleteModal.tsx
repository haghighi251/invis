"use client";

import { useDeleteUser } from "@/modules/invis/hooks/useDeleteUser";
import { UserMessages } from "@/modules/shared/types/UserMessages";
import { Alert, Button, Modal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  HiOutlineExclamationCircle,
  HiInformationCircle,
} from "react-icons/hi";

export type DeleteModalProps = {
  userId: number;
  show: boolean;
  onClose: () => void;
};

export function DeleteModalComponent({
  userId,
  show,
  onClose,
}: DeleteModalProps) {
  const router = useRouter();
  const {
    deleteUserIsLoading,
    deleteUserIsError,
    deleteUserIsSuccess,
    error,
    deleteUser,
  } = useDeleteUser({ userId });

  useCallback(() => {
    if (deleteUserIsSuccess) router.push("/");
  }, [deleteUserIsSuccess, router]);

  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-1 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {UserMessages.DELETE_USER_MESSAGE}
          </h3>
          {deleteUserIsError && (
            <Alert color="failure" icon={HiInformationCircle} className="mb-3">
              <span className="font-medium">{error}</span>
            </Alert>
          )}
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={deleteUser}
              {...(deleteUserIsLoading && { isProcessing: true })}
            >
              {UserMessages.CONFIRM_MESSAGE}
            </Button>
            <Button color="gray" onClick={onClose}>
              {UserMessages.CANCELATION_MESSAGE}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
