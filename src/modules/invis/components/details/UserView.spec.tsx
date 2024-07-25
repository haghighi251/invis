import { fireEvent, render, screen } from "@testing-library/react";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import UserView from "./UserView";
import { UserMessages } from "@/modules/shared/types/UserMessages";

describe("UserView", () => {
  it("should Show an alert with error if there is no user data in the user prop", () => {
    render(<UserView user={null} />);

    expect(
      screen.getByText(UserMessages.INVALID_USER_DATA_ERROR)
    ).toBeInTheDocument();
  });

  it("should Show the user view", () => {
    render(<UserView user={invisMockedUsers[0]} />);

    expect(
      screen.queryByText(UserMessages.INVALID_USER_DATA_ERROR)
    ).not.toBeInTheDocument();

    const userImage = screen.getByRole("img", {
      name: invisMockedUsers[0].name,
    });

    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute(
      "src",
      `/profiles/profile-picture-${invisMockedUsers[0].id}.jpg`
    );
    expect(screen.getByText(invisMockedUsers[0].name)).toBeInTheDocument();
    expect(screen.getByText(invisMockedUsers[0].email)).toBeInTheDocument();
  });

  it("should show the user delete modal if the delete button clicked", () => {
    render(<UserView user={invisMockedUsers[0]} />);

    const deleteButton = screen.getByRole('button', {name: 'Delete'});

    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton);

    expect(screen.getByText(UserMessages.DELETE_USER_MESSAGE)).toBeInTheDocument();
  });

  it("should close the user delete modal if the close button clicked on the modal", () => {
    render(<UserView user={invisMockedUsers[0]} />);

    const deleteButton = screen.getByRole('button', {name: 'Delete'});

    expect(deleteButton).toBeDefined();
    fireEvent.click(deleteButton);

    expect(screen.getByText(UserMessages.DELETE_USER_MESSAGE)).toBeInTheDocument();

    const modalCloseButton = screen.getByRole('button', {name: UserMessages.CANCELATION_MESSAGE});

    expect(modalCloseButton).toBeInTheDocument();

    fireEvent.click(modalCloseButton);

    expect(screen.queryByText(UserMessages.DELETE_USER_MESSAGE)).not.toBeInTheDocument();
  });
});
