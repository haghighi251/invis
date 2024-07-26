import { axiosClient } from "@/infrastructure/http/AxiosClient";
import { APIResponse } from "@/shared/types/APIResponse";
import { deleteUser, UserIDSchema } from "./deleteUser";
import { ZodError, ZodIssue } from "zod";

jest.mock("@/infrastructure/http/AxiosClient", () => ({
  axiosClient: {
    delete: jest.fn(),
  },
}));

const axiosClientMocked = axiosClient as jest.Mocked<typeof axiosClient>;

describe("deleteUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserIDSchema.parse = jest.fn().mockImplementation(() => {
      return;
    });
  });

  it("should make a DELETE request to the correct URL", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: [],
    };
    (axiosClient.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await deleteUser(1);
    expect(axiosClient.delete).toHaveBeenCalledWith(
      "/api/invis/users/delete/1"
    );
    expect(result).toEqual(mockResponse);
    expect(axiosClientMocked.delete).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.delete).toHaveBeenCalledWith(
      "/api/invis/users/delete/1"
    );
  });

  it("should handle a successful response", async () => {
    const mockResponse: APIResponse = {
      success: true,
      error: undefined,
      data: null,
    };

    (axiosClient.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await deleteUser(1)) as APIResponse;
    expect(result.success).toBe(true);
    expect(result.data).toEqual(null);
    expect(axiosClientMocked.delete).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.delete).toHaveBeenCalledWith(
      "/api/invis/users/delete/1"
    );
  });

  it("should return an error when the userId is not a valid userId", async () => {
    const invalidUserId = -1;

    UserIDSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        { message: "ID must be a positive integer" },
      ] as ZodIssue[]);
    });
    await expect(deleteUser(invalidUserId)).rejects.toThrow(
      "ID must be a positive integer"
    );
    expect(axiosClientMocked.delete).toHaveBeenCalledTimes(0);
  });

  it("should throw a ZodError if the userId is invalid", async () => {
    const invalidUserId = -1;

    UserIDSchema.parse = jest.fn().mockImplementation(() => {
      throw new ZodError([
        { message: "ID must be a positive integer" },
      ] as ZodIssue[]);
    });

    await expect(deleteUser(invalidUserId)).rejects.toThrow(
      "ID must be a positive integer"
    );
  });

  it("should throw an error if axiosClient.delete throws an error", async () => {
    (axiosClient.delete as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await expect(deleteUser(1)).rejects.toThrow("Network error");
    expect(axiosClientMocked.delete).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.delete).toHaveBeenCalledWith(
      "/api/invis/users/delete/1"
    );
  });

  it("should handle an error response from the server", async () => {
    const mockResponse: APIResponse = {
      success: false,
      error: "Server error",
      data: null,
    };
    (axiosClient.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = (await deleteUser(1)) as APIResponse;
    expect(result.success).toBe(false);
    expect(result.error).toBe("Server error");
    expect(axiosClientMocked.delete).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.delete).toHaveBeenCalledWith(
      "/api/invis/users/delete/1"
    );
  });

  it("should throw an error when the network request fails", async () => {
    const mockError = new Error("Network error");
    (axiosClient.delete as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(deleteUser(1)).rejects.toThrow("Network error");
    expect(axiosClientMocked.delete).toHaveBeenCalledTimes(1);
    expect(axiosClientMocked.delete).toHaveBeenCalledWith(
      "/api/invis/users/delete/1"
    );
  });
});
