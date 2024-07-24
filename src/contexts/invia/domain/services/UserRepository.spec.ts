import "reflect-metadata";
import axios, { AxiosError } from "axios";
import { User } from "@/shared/types/invis/UserSchema";
import { err, ok } from "neverthrow";
import { UserRepository } from "./user.service";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { waitFor } from "@testing-library/dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    // For unit tests, it is generally best to mock environment variables to ensure a controlled and consistent test environment.
    // This can sometimes lead to flaky tests if those variables depend on external services or if they are subject to change.
    process.env.BFF_URL = "http://fakeurl.com";
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.BFF_URL;
  });

  it("should return a list of users on success", async () => {
    mockedAxios.get.mockResolvedValue({ status: 200, data: invisMockedUsers });

    const result = await userRepository.findAll();

    expect(result).toEqual(ok(invisMockedUsers));
    expect(mockedAxios.get).toHaveBeenCalledWith("/users", {
      baseURL: process.env.BFF_URL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("should return an error when BFF_URL is not defined", async () => {
    delete process.env.BFF_URL;

    await expect(userRepository.findAll()).resolves.toEqual(
      err("BFF_URL environment variable is not defined.")
    );
  });

  it("should return an error when the server returns a non-200 status", async () => {
    mockedAxios.get.mockResolvedValue({ status: 500 });

    const result = await userRepository.findAll();

    expect(result).toEqual(err("Data is not fetched from the server."));
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it("should return an error message from AxiosError", async () => {
    const errorMessage = "Data is not fetched from the server.";
    mockedAxios.get.mockRejectedValue(new AxiosError(errorMessage));

    const result = await userRepository.findAll();

    waitFor(() => {
      expect(result).toEqual(err(errorMessage));
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  it("should return a generic error message for unknown errors", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Unknown Error"));

    const result = await userRepository.findAll();

    expect(result).toEqual(err("Unknown Error"));
    expect(mockedAxios.get).toHaveBeenCalled();
  });
});
