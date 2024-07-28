import { useUserList } from "@modules/invis/hooks/useUserList";
import { render, screen, waitFor } from "@testing-library/react";
import UsersList from "./UsersList";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { useAddUser } from "@/modules/invis/hooks/useAddUser";
import { useUpdateUser } from "@/modules/invis/hooks/useUpdateUser";

jest.mock("@modules/invis/hooks/useUserList", () => ({
  useUserList: jest.fn(),
}));
const useUserListMocked = useUserList as jest.MockedFn<typeof useUserList>;

jest.mock("next/navigation");
jest.mock("@/modules/invis/hooks/useAddUser");
const useAddUserMock = useAddUser as jest.MockedFn<typeof useAddUser>;

jest.mock("@/modules/invis/hooks/useUpdateUser");
const useUpdateUserMock = useUpdateUser as jest.MockedFn<typeof useUpdateUser>;

const useUserListMockedResponse = {
  usersListIsLoading: true,
  usersListIsError: false,
  error: undefined,
  usersList: null,
};

describe("UsersList component", () => {
  beforeEach(() => {
    // useUserListMocked.mockClear();
    // useAddUserMock.mockClear();
    useAddUserMock.mockReturnValue({
      addUserIsLoading: false,
      addUserIsError: false,
      addUserIsSuccess: false,
      error: undefined,
      addUserMutation: jest.fn(),
    });
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

  it("should SHOW loading with out error and user data", async () => {
    useUserListMocked.mockReturnValue(useUserListMockedResponse);

    render(<UsersList />);

    expect(
      screen.getByRole("heading", { name: "Users list" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Loading ...." })
    ).toBeInTheDocument();
  });

  it("should SHOW the users without loading and error", async () => {
    useUserListMocked.mockReturnValue({
      ...useUserListMockedResponse,
      usersListIsLoading: false,
      usersList: invisMockedUsers,
    });

    render(<UsersList />);

    expect(
      screen.getByRole("heading", { name: "Users list" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading ...." })
    ).not.toBeInTheDocument();
    waitFor(() => {
      expect(
        screen.getByText(invisMockedUsers[0].username)
      ).toBeInTheDocument();
      expect(screen.getByText(invisMockedUsers[0].email)).toBeInTheDocument();
      expect(
        screen.getByText(invisMockedUsers[1].username)
      ).toBeInTheDocument();
      expect(screen.getByText(invisMockedUsers[1].email)).toBeInTheDocument();
    });
  });

  it("should NOT show the users when there is an error", async () => {
    useUserListMocked.mockReturnValue({
      ...useUserListMockedResponse,
      usersListIsLoading: false,
      usersListIsError: true,
      error: "ERROR TEXT",
    });

    render(<UsersList />);

    expect(
      screen.getByRole("heading", { name: "Users list" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading ...." })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Username:")).not.toBeInTheDocument();
    expect(screen.queryByText("Email:")).not.toBeInTheDocument();
    expect(screen.getByText("ERROR TEXT")).toBeInTheDocument();
  });
});
