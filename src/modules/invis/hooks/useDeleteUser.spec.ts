import { useDeleteUser } from "./useDeleteUser";
import { createWrapper } from "@/__mocks__/hookWrapper";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryKey } from "@/modules/shared/types/QueryKey";
import { queryClient } from "@/components/ReactQuery/ReactQueryProvider";

export const deleteUser = jest.fn();

jest.mock("@/modules/invis/services/deleteUser");
jest.mock("@/components/ReactQuery/ReactQueryProvider", () => ({
  queryClient: {
    invalidateQueries: jest.fn(),
  },
}));
const invalidateQueriesMocked = queryClient.invalidateQueries as jest.MockedFn<typeof queryClient.invalidateQueries>;

const { wrapper } = createWrapper();

describe("useDeleteUser hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success state on successful delete", async () => {
    deleteUser.mockResolvedValue({ success: true });

    const { result } = renderHook(
      () => useDeleteUser({ userId: 1 }),
      { wrapper }
    );

    act(() => {
      result.current.deleteUser();
    });

    waitFor(() => {
      expect(result.current.deleteUserIsSuccess).toBe(true);
      expect(result.current.error).toBeUndefined();
      expect(invalidateQueriesMocked).toHaveBeenCalledTimes(1);
      expect(invalidateQueriesMocked).toHaveBeenCalledWith({
        queryKey: [QueryKey.UsersList],
      });
    });
  });

  it("should return error state on delete failure", async () => {
    deleteUser.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(
      () => useDeleteUser({ userId: 1 }),
      { wrapper }
    );

    act(() => {
      result.current.deleteUser();
    });

    waitFor(() => {
      expect(result.current.deleteUserIsError).toBe(true);
      expect(result.current.error).toBe(
        "Error deleting user: Error: Delete failed"
      );
      expect(invalidateQueriesMocked).toHaveBeenCalledTimes(0);
    });
  });

  it("should update loading state correctly", async () => {
    deleteUser.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100)
        )
    );

    const { result } = renderHook(
      () => useDeleteUser({ userId: 1 }),
      { wrapper }
    );

    act(() => {
      result.current.deleteUser();
    });

    waitFor(() => {
      expect(result.current.deleteUserIsLoading).toBe(true);
      expect(result.current.deleteUserIsLoading).toBe(false);
      expect(result.current.deleteUserIsSuccess).toBe(true);
      expect(invalidateQueriesMocked).toHaveBeenCalledTimes(0);
    });
  });
});
