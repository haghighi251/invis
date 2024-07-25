import { renderHook, waitFor } from "@testing-library/react";
import { useUserList } from "./useUserList";
import { invisMockedUsers } from "@/__mocks__/invis/users";

import { createWrapper } from "@/__mocks__/hookWrapper";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { APIResponse } from "@/shared/types/APIResponse";

jest.mock("@tanstack/react-query", () => {
  const originalModule = jest.requireActual("@tanstack/react-query");
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});
const mockedUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

jest.mock("@/modules/invis/services/getUsers");

jest.mock('@/infrastructure/http/AxiosClient', () => ({
  get: jest.fn(),
}));

const { wrapper } = createWrapper();

describe("useUserList Hook", () => {
  beforeEach(() => {
    mockedUseQuery.mockClear();
  });

  it("should return loading with no users and error(initial loading)", async () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as UseQueryResult);

    const { result } = renderHook(useUserList, { wrapper });

    await waitFor(() => expect(result.current.usersListIsLoading).toBe(true));

    expect(result.current.usersListIsError).toBe(false);
    expect(result.current.usersListIsLoading).toBe(true);
    expect(result.current.usersList).toBe(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });

  it("should return a list of users", async () => {
    mockedUseQuery.mockReturnValue({
      data: {
        success: true,
        error: "",
        data: invisMockedUsers,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as UseQueryResult);

    const { result } = renderHook(useUserList, { wrapper });

    await waitFor(() => expect(result.current.usersListIsLoading).toBe(false));

    expect(result.current.error).toBe(undefined);
    expect(result.current.usersListIsError).toBe(false);
    expect(result.current.usersListIsLoading).toBe(false);
    expect(result.current.usersList).toEqual(invisMockedUsers);
    expect(result.current.usersList?.length).toBe(2);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });

  it("should return error with no users when server returns an error", async () => {
    mockedUseQuery.mockReturnValue({
      data: {
        success: false,
        error: "SERVER ERROR TEXT",
        data: null,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as UseQueryResult);

    const { result } = renderHook(useUserList, { wrapper });

    await waitFor(() => expect(result.current.usersListIsLoading).toBe(false));

    expect(result.current.error).toBe("SERVER ERROR TEXT");
    expect(result.current.usersListIsError).toBe(false);
    expect(result.current.usersList).toBe(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });

  it("should handle an empty user list", async () => {
    mockedUseQuery.mockReturnValue({
      data: {
        success: true,
        error: "",
        data: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    } as UseQueryResult);
  
    const { result } = renderHook(useUserList, { wrapper });
  
    await waitFor(() => expect(result.current.usersListIsLoading).toBe(false));
  
    expect(result.current.error).toBe(undefined);
    expect(result.current.usersListIsError).toBe(false);
    expect(result.current.usersList).toEqual([]);
    expect(result.current.usersList?.length).toBe(0);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });
  

  it("should return error with no users when server returns an error", async () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(
        "Something went wrong while fetching data from the server. Please refresh the page and try again."
      ),
    } as UseQueryResult);

    const { result } = renderHook(useUserList, { wrapper });

    await waitFor(() => expect(result.current.usersListIsLoading).toBe(false));

    expect(result.current.error).toBe("Something went wrong while fetching data from the server. Please refresh the page and try again.");
    expect(result.current.usersListIsError).toBe(true);
    expect(result.current.usersList).toBe(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });
});
