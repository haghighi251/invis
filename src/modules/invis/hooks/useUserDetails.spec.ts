import { renderHook, waitFor } from "@testing-library/react";
import { invisMockedUsers } from "@/__mocks__/invis/users";

import { createWrapper } from "@/__mocks__/hookWrapper";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useUserDetails } from "./useUserDetails";
import { UserMessages } from "@/modules/shared/types/UserMessages";

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

describe("useUserDetails Hook", () => {
  beforeEach(() => {
    mockedUseQuery.mockClear();
  });

  it("should return loading with no user and error(initial loading)", async () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as UseQueryResult);

    const { result } = renderHook(() => useUserDetails({userId: 1}), { wrapper });

    await waitFor(() => expect(result.current.userDetailsIsLoading).toBe(true));

    expect(result.current.userDetailsIsError).toBe(false);
    expect(result.current.user).toBe(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });

  it("should return a user", async () => {
    mockedUseQuery.mockReturnValue({
      data: {
        success: true,
        error: "",
        data: invisMockedUsers[0],
      },
      isLoading: false,
      isError: false,
      error: null,
    } as UseQueryResult);

    const { result } = renderHook(() => useUserDetails({userId: 1}), { wrapper });

    await waitFor(() => expect(result.current.userDetailsIsLoading).toBe(false));

    expect(result.current.error).toBe(undefined);
    expect(result.current.userDetailsIsError).toBe(false);
    expect(result.current.user).toEqual(invisMockedUsers[0]);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });

  it("should return error with no user when server returns an error", async () => {
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

    const { result } = renderHook(() => useUserDetails({userId: 1})
    , { wrapper });

    await waitFor(() => expect(result.current.userDetailsIsLoading).toBe(false));

    expect(result.current.error).toBe("SERVER ERROR TEXT");
    expect(result.current.userDetailsIsError).toBe(false);
    expect(result.current.user).toBe(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });

  it("should handle an empty user object", async () => {
    mockedUseQuery.mockReturnValue({
      data: {
        success: true,
        error: "",
        data: null,
      },
      isLoading: false,
      isError: false,
      error: null,
    } as UseQueryResult);
  
    const { result } = renderHook(() => useUserDetails({userId: 1}), { wrapper });
  
    await waitFor(() => expect(result.current.userDetailsIsLoading).toBe(false));
  
    expect(result.current.error).toBe(undefined);
    expect(result.current.userDetailsIsError).toBe(false);
    expect(result.current.user).toEqual(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(1);
  });
  

  it("should return error with no users when server returns an error", async () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(UserMessages.SERVER_UNKNOWN_ERROR),
    } as UseQueryResult);

    const { result } = renderHook(() => useUserDetails({userId: 1}), { wrapper });

    await waitFor(() => expect(result.current.userDetailsIsLoading).toBe(false));

    expect(result.current.error).toBe(UserMessages.SERVER_UNKNOWN_ERROR);
    expect(result.current.userDetailsIsError).toBe(true);
    expect(result.current.user).toBe(null);
    expect(mockedUseQuery).toHaveBeenCalledTimes(2);
  });
});
