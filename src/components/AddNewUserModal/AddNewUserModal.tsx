"use client";
import { useAddUser } from "@/modules/invis/hooks/useAddUser";
import {
  hasMinLengthOf3,
  isNotEmpty,
  isValidEmailAddress,
} from "@/modules/shared/components/FormsVaslidation";
import { getFormValues } from "@/modules/shared/components/FormUtil";
import { Fields } from "@/modules/shared/types/AddUserFields";
import { User } from "@/shared/types/invis/UserSchema";
import {
  Alert,
  Button,
  Label,
  Modal,
  TextInput,
} from "flowbite-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";

export type AddNewUserModalProps = {
  openModal: boolean;
  setOpenModal: (openStatus: boolean) => void;
  lastUserId: number;
};

type FieldValues = Omit<User, "id">;

export function AddNewUserModal({
  openModal,
  setOpenModal,
  lastUserId,
}: AddNewUserModalProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const {
    addUserIsLoading,
    addUserIsError,
    addUserIsSuccess,
    error,
    addUserMutation,
  } = useAddUser();

  useEffect(() => {
    if (addUserIsSuccess) setOpenModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserIsSuccess]);

  const onHandleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const values = getFormValues(event);

    if (AddNewUserModal.isValid(values)) {
      addUserMutation({
        ...values,
        id: lastUserId + 1,
      });
    }
  };

  return (
    <Modal
      show={openModal}
      size="md"
      popup
      onClose={() => setOpenModal(false)}
      initialFocus={nameInputRef}
    >
      <Modal.Header />
      <Modal.Body>
        <form className="space-y-6" onSubmit={onHandleSubmit}>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Add a new user
          </h3>
          {addUserIsError && (
            <Alert color="failure" icon={HiInformationCircle} className="mb-3">
              <span className="font-medium">{error}</span>
            </Alert>
          )}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Your name" />
            </div>
            <TextInput
              id="name"
              name={Fields.NAME}
              ref={nameInputRef}
              placeholder="john doe"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Your username" />
            </div>
            <TextInput
              id="username"
              name={Fields.USERNAME}
              placeholder="john"
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Your email" />
            </div>
            <TextInput
              id="email"
              name={Fields.EMAIL}
              placeholder="john@company.com"
              required
            />
          </div>
          <div className="w-full">
            <Button
              type="submit"
              {...(addUserIsLoading && { isProcessing: true })}
            >
              Add new user
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

AddNewUserModal.isValid = (
  values: Partial<FieldValues>
): values is FieldValues => {
  return (
    hasMinLengthOf3(values[Fields.NAME]) &&
    isNotEmpty(values[Fields.USERNAME]) &&
    isValidEmailAddress(values[Fields.EMAIL])
  );
};
