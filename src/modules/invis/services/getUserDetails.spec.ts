// src/services/getUsers.spec.ts
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { axiosClient } from "@/infrastructure/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";
import { getUserDetails, UserIDSchema } from "./getUserDetails";
import { ZodError, ZodIssue } from "zod";

jest.mock("@/infrastructure/http/AxiosClient", () => ({
  axiosClient: {
    get: jest.fn(),
  },
}));

const axiosClientMocked = axiosClient as jest.Mocked<typeof axiosClient>;

describe("getUserDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserIDSchema.parse = jest.fn().mockImplementation(() => {
      return;
    });
  });

  it("should make a GET request to the correct URL", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: [],
    };
    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await getUserDetails(1);
    expect(axiosClient.get).toHaveBeenCalledWith("/api/invis/users/1");
    expect(result).toEqual(mockResponse);
    expect(axiosClientMocked.get).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.get).toHaveBeenCalledWith("/api/invis/users/1");
  });

  it("should handle a successful response with the user details", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: invisMockedUsers[0],
    };

    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await getUserDetails(1)) as APIResponse;
    expect(result.success).toBe(true);
    expect(result.data).toEqual(invisMockedUsers[0]);
    expect(axiosClientMocked.get).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.get).toHaveBeenCalledWith("/api/invis/users/1");
  });

  it("should handle an error response with no user found", async () => {
    const mockResponse: APIResponse = {
      success: false,
      error: "No user found with the given userId.",
      data: null,
    };
    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await getUserDetails(3)) as APIResponse;
    expect(result.success).toBe(false);
    expect(result.data).toBe(null);
    expect(result.error).toBe("No user found with the given userId.");
    expect(axiosClientMocked.get).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.get).toHaveBeenCalledWith("/api/invis/users/3");
  });

  it("should return an error when the userId is not a valid userId", async () => {
    const invalidUserId = -1;

    UserIDSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        { message: "ID must be a positive integer" },
      ] as ZodIssue[]);
    });

    await expect(getUserDetails(invalidUserId)).rejects.toThrow(
      "ID must be a positive integer"
    );
    expect(axiosClientMocked.get).toHaveBeenCalledTimes(0);
  });

  it("should handle an error response from the server", async () => {
    const mockResponse: APIResponse = {
      success: false,
      error: "Server error",
      data: null,
    };
    (axiosClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await getUserDetails(1)) as APIResponse;
    expect(result.success).toBe(false);
    expect(result.error).toBe("Server error");
    expect(axiosClientMocked.get).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.get).toHaveBeenCalledWith("/api/invis/users/1");
  });

  it("should throw an error when the network request fails", async () => {
    const mockError = new Error("Network error");
    (axiosClient.get as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(getUserDetails(1)).rejects.toThrow("Network error");
    expect(axiosClientMocked.get).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.get).toHaveBeenCalledWith("/api/invis/users/1");
  });
});
