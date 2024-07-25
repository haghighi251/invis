// src/services/getUsers.spec.ts
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { getUsers } from "./getUsers";
import { axiosClient } from "@/infrastructure/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";

jest.mock("@/infrastructure/http/AxiosClient", () => ({
  axiosClient: {
    get: jest.fn(),
  },
}));

describe("getUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a GET request to the correct URL", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: [],
    };
    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await getUsers();
    expect(axiosClient.get).toHaveBeenCalledWith("/api/invis/users");
    expect(result).toEqual(mockResponse);
  });

  it("should handle a successful response with users", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: invisMockedUsers,
    };

    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await getUsers()) as APIResponse;
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual(invisMockedUsers);
  });

  it("should handle a successful response with no users", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: [],
    };
    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await getUsers()) as APIResponse;
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(0);
  });

  it("should handle an error response from the server", async () => {
    const mockResponse: APIResponse = {
      success: false,
      error: "Server error",
      data: null,
    };
    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await getUsers()) as APIResponse;
    expect(result.success).toBe(false);
    expect(result.error).toBe("Server error");
  });

  it("should throw an error when the network request fails", async () => {
    const mockError = new Error("Network error");
    (axiosClient.get as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(getUsers()).rejects.toThrow("Network error");
  });
});
