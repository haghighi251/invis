import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import UsersListView from "./UsersListView";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { useUpdateUser } from "@/modules/invis/hooks/useUpdateUser";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/modules/invis/hooks/useUpdateUser");
const useUpdateUserMock = useUpdateUser as jest.MockedFn<typeof useUpdateUser>;

describe("UsersListView", () => {
  const useRouterMock = useRouter as jest.Mock;
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouterMock.mockReturnValue({ push: pushMock });
    useUpdateUserMock.mockReturnValue({
      updateUserIsLoading: false,
      updateUserIsError: false,
      updateUserIsSuccess: false,
      error: undefined,
      updateUserMutation: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should Show an alert if there is no users in the users prop", () => {
    render(<UsersListView users={[]} />);

    expect(
      screen.getByText("There is no user to be shown.")
    ).toBeInTheDocument();
  });

  it("should Show the user view", () => {
    render(<UsersListView users={invisMockedUsers} />);

    expect(
      screen.queryByText("There is no user to be shown.")
    ).not.toBeInTheDocument();

    const firstUserImage = screen.getByRole("img", {
      name: invisMockedUsers[0].name,
    });

    expect(firstUserImage).toBeInTheDocument();
    expect(firstUserImage).toHaveAttribute(
      "src",
      `/profiles/profile-picture-${invisMockedUsers[0].id}.jpg`
    );
    expect(screen.getByText(invisMockedUsers[0].name)).toBeInTheDocument();
    expect(screen.getByText(invisMockedUsers[0].email)).toBeInTheDocument();

    const secondUserImage = screen.getByRole("img", {
      name: invisMockedUsers[1].name,
    });

    expect(secondUserImage).toBeInTheDocument();
    expect(secondUserImage).toHaveAttribute(
      "src",
      `/profiles/profile-picture-${invisMockedUsers[1].id}.jpg`
    );
    expect(screen.getByText(invisMockedUsers[1].name)).toBeInTheDocument();
    expect(screen.getByText(invisMockedUsers[1].email)).toBeInTheDocument();
  });

  it("should open the `/user/:id` route if a specific user is clicked.", () => {
    render(<UsersListView users={invisMockedUsers} />);

    const theFirstUser = screen.getByTestId(`user${invisMockedUsers[0].id}`);

    expect(theFirstUser).toBeDefined();
    fireEvent.click(theFirstUser);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(`/user/${invisMockedUsers[0].id}`);
  });
});
