"use client";
import {
  hasMinLengthOf3,
  isNotEmpty,
  isValidEmailAddress,
} from "@/modules/shared/components/FormsVaslidation";
import { getFormValues } from "@/modules/shared/components/FormUtil";
import { Fields } from "@/modules/shared/types/AddUserFields";
import { User } from "@/shared/types/invis/UserSchema";
import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { useUpdateUser } from "@/modules/invis/hooks/useUpdateUser";

export type UpdateUserModalProps = {
  openModal: boolean;
  setOpenModal: (openStatus: boolean) => void;
  user: User | null;
};

type FieldValues = Omit<User, "id">;

export function UpdateUserModal({
  openModal,
  setOpenModal,
  user,
}: UpdateUserModalProps) {
  const [formValues, setFormValues] = useState<FieldValues>({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    profileImage: user?.profileImage || '',
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  const {
    updateUserIsLoading,
    updateUserIsError,
    updateUserIsSuccess,
    error,
    updateUserMutation,
  } = useUpdateUser();

  useEffect(() => {
    if (updateUserIsSuccess) setOpenModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserIsSuccess]);

  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof FieldValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [field]: event.target.value });
  };

  const onHandleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const values = getFormValues(event);

    if (user && UpdateUserModal.isValid(values)) {
      updateUserMutation(user.id, values);
    }
  };

  if(!user) {
    setOpenModal(false);
    return;
  }

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
          {updateUserIsError && (
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
              value={formValues.name}
              onChange={handleChange(Fields.NAME)}
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
              value={formValues.username}
              onChange={handleChange(Fields.USERNAME)}
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
              value={user.email}
              onChange={handleChange(Fields.EMAIL)}
              placeholder="john@company.com"
              required
            />
          </div>
          <div className="w-full my-5">
            <Button
              type="submit"
              {...(updateUserIsLoading && { isProcessing: true })}
            >
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

UpdateUserModal.isValid = (
  values: Partial<FieldValues>
): values is FieldValues => {
  return (
    hasMinLengthOf3(values[Fields.NAME]) &&
    isNotEmpty(values[Fields.USERNAME]) &&
    isValidEmailAddress(values[Fields.EMAIL])
  );
};
