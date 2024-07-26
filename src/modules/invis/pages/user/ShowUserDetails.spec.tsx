import { useUserDetails } from "@modules/invis/hooks/useUserDetails";
import { render, screen, waitFor } from "@testing-library/react";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import ShowUserDetails from "./ShowUserDetails";
import { useDeleteUser } from "@modules/invis/hooks/useDeleteUser";

jest.mock("next/navigation");
jest.mock("@/components/ReactQuery/ReactQueryProvider", () => ({
  queryClient: {
    invalidateQueries: jest.fn(),
  },
}));

jest.mock("@/modules/invis/hooks/useDeleteUser", () => ({
  useDeleteUser: jest.fn(),
}));
const useDeleteUserMocked = useDeleteUser as jest.MockedFn<
  typeof useDeleteUser
>;

jest.mock("@modules/invis/hooks/useUserDetails", () => ({
  useUserDetails: jest.fn(),
}));
const useUserDetailsMocked = useUserDetails as jest.MockedFn<
  typeof useUserDetails
>;

const useUserListMockedResponse = {
  userDetailsIsLoading: true,
  userDetailsIsError: false,
  error: undefined,
  user: null,
};

describe("ShowUserDetails component", () => {
  beforeEach(() => {
    useUserDetailsMocked.mockClear();
    useDeleteUserMocked.mockClear();
    useDeleteUserMocked.mockReturnValue({
      deleteUserIsLoading: false,
      deleteUserIsError: false,
      deleteUserIsSuccess: false,
      error: undefined,
      deleteUser: jest.fn(),
    });
  });
  it("should SHOW loading without error and user data", async () => {
    useUserDetailsMocked.mockReturnValue(useUserListMockedResponse);

    render(<ShowUserDetails userId={1} />);

    expect(
      screen.getByRole("heading", { name: "User Details:" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Loading ...." })
    ).toBeInTheDocument();
  });

  it("should SHOW the user without loading and error", async () => {
    useUserDetailsMocked.mockReturnValue({
      ...useUserListMockedResponse,
      userDetailsIsLoading: false,
      user: invisMockedUsers[0],
    });

    render(<ShowUserDetails userId={1} />);

    expect(
      screen.getByRole("heading", { name: "User Details:" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading ...." })
    ).not.toBeInTheDocument();
    waitFor(() => {
      expect(
        screen.getByText(invisMockedUsers[0].username)
      ).toBeInTheDocument();
      expect(screen.getByText(invisMockedUsers[0].email)).toBeInTheDocument();
    });
  });

  it("should NOT show the user when there is an error", async () => {
    useUserDetailsMocked.mockReturnValue({
      ...useUserListMockedResponse,
      userDetailsIsLoading: false,
      userDetailsIsError: true,
      error: "ERROR TEXT",
    });

    render(<ShowUserDetails userId={0} />);

    expect(
      screen.getByRole("heading", { name: "User Details:" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: "Loading ...." })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Username:")).not.toBeInTheDocument();
    expect(screen.queryByText("Email:")).not.toBeInTheDocument();
    expect(screen.getByText("ERROR TEXT")).toBeInTheDocument();
  });
});
