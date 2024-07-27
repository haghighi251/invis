import "reflect-metadata";
import axios, { AxiosError } from "axios";
import { err, ok } from "neverthrow";
import { UserRepository } from "./UserRepository";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { waitFor } from "@testing-library/dom";
import { User } from "@/shared/types/invis/UserSchema";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    // For unit tests, it is generally best to mock environment variables to ensure a controlled and consistent test environment.
    // This can sometimes lead to flaky tests if those variables depend on external services or if they are subject to change.
    process.env.BFF_URL = "http://fakeurl.com";
    process.env.REQUEST_TIMEOUT = "5000";
    userRepository = new UserRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.BFF_URL;
  });

  it("should throw an error when BFF_URL is not defined", () => {
    delete process.env.BFF_URL;
    expect(() => new UserRepository()).toThrow("BFF_URL environment variable is not defined.");
  });

  describe("UserRepository - findAll method", () => {

    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: invisMockedUsers,
      });
    });

    it("should NOT run on the DELETE, POST, PUT, PATCH", async () => {
      await userRepository.findAll();

      expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(0);
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });
    it("should return a list of users on success", async () => {
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

  describe("UserRepository - findUserById method", () => {
    const userId = 1;

    beforeEach(() => {
      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: invisMockedUsers[0],
      });
    });

    it("should NOT run on the DELETE, POST, PUT, PATCH", async () => {
      await userRepository.findUserById(userId);

      expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(0);
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should return a user on success", async () => {
      const result = await userRepository.findUserById(userId);

      expect(result).toEqual(ok(invisMockedUsers[0]));
      expect(mockedAxios.get).toHaveBeenCalledWith(`/users/${userId}`, {
        baseURL: process.env.BFF_URL,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("should return an error when the server returns a non-200 status", async () => {
      mockedAxios.get.mockResolvedValue({ status: 500 });

      const result = await userRepository.findUserById(userId);

      expect(result).toEqual(err("Data is not fetched from the server."));
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it("should return an error message from AxiosError", async () => {
      const errorMessage = "Data is not fetched from the server.";
      mockedAxios.get.mockRejectedValue(new AxiosError(errorMessage));

      const result = await userRepository.findUserById(userId);

      waitFor(() => {
        expect(result).toEqual(err(errorMessage));
        expect(mockedAxios.get).toHaveBeenCalled();
      });
    });

    it("should return a generic error message for unknown errors", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Unknown Error"));

      const result = await userRepository.findUserById(userId);

      expect(result).toEqual(err("Unknown Error"));
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  describe("UserRepository - deleteUserById method", () => {
    const userId = 1;

    beforeEach(() => {
      mockedAxios.delete.mockResolvedValue({
        status: 200,
        data: true,
      });
    });

    it("should NOT run on the GET, POST, PUT, PATCH", async () => {
      await userRepository.deleteUserById(userId);

      expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
      expect(mockedAxios.get).toHaveBeenCalledTimes(0);
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });
    it("should remove a user on success", async () => {
      const result = await userRepository.deleteUserById(userId);

      expect(result).toEqual(ok(true));
      expect(mockedAxios.delete).toHaveBeenCalledWith(`/users/${userId}`, {
        baseURL: process.env.BFF_URL,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("should return an error when the server returns a non-200 status", async () => {
      mockedAxios.delete.mockResolvedValue({ status: 500 });

      const result = await userRepository.deleteUserById(userId);

      expect(result).toEqual(
        err("Delete operation is not completed on the server.")
      );
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });

    it("should return an error message from AxiosError", async () => {
      const errorMessage = "Delete operation is not completed on the server.";
      mockedAxios.delete.mockRejectedValue(new AxiosError(errorMessage));

      const result = await userRepository.deleteUserById(userId);

      waitFor(() => {
        expect(result).toEqual(err(errorMessage));
        expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
        expect(mockedAxios.delete).toHaveBeenCalledWith(`/users/${userId}`);
      });
    });

    it("should return a generic error message for unknown errors", async () => {
      mockedAxios.delete.mockRejectedValue(new Error("Unknown Error"));

      const result = await userRepository.deleteUserById(userId);

      expect(result).toEqual(err("Unknown Error"));
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe("UserRepository - addNewUser method", () => {
    const userId = 1;

    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: true,
      });
    });

    it("should NOT run on the GET, PATCH, PUT, DELETE", async () => {
      await userRepository.addNewUser(invisMockedUsers[0]);

      expect(mockedAxios.patch).toHaveBeenCalledTimes(0);
      expect(mockedAxios.get).toHaveBeenCalledTimes(0);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(0);
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should add a user on success", async () => {
      const result = await userRepository.addNewUser(invisMockedUsers[0]);

      expect(result).toEqual(ok(true));
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/users`,
        invisMockedUsers[0],
        {
          baseURL: process.env.BFF_URL,
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should return an error when the server returns a non-200 status", async () => {
      mockedAxios.post.mockResolvedValue({ status: 500 });

      const result = await userRepository.addNewUser(invisMockedUsers[0]);

      expect(result).toEqual(
        err("Add new user operation is not completed on the server.")
      );
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it("should return an error message from AxiosError", async () => {
      const errorMessage = "Add new user operation is not completed on the server.";
      mockedAxios.post.mockRejectedValue(new AxiosError(errorMessage));

      const result = await userRepository.addNewUser(invisMockedUsers[0]);

      waitFor(() => {
        expect(result).toEqual(err(errorMessage));
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(`/users/${userId}`);
      });
    });

    it("should return a generic error message for unknown errors", async () => {
      mockedAxios.post.mockRejectedValue(new Error("Unknown Error"));

      const result = await userRepository.addNewUser(invisMockedUsers[0]);

      expect(result).toEqual(err("Unknown Error"));
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("UserRepository - updateUser method", () => {
    const userId = 1;
    const mockedUpdateUser: Partial<User> = {
      name: invisMockedUsers[0].name,
      username: invisMockedUsers[0].username,
      email: invisMockedUsers[0].email
    }

    beforeEach(() => {
      mockedAxios.patch.mockResolvedValue({
        status: 200,
        data: true,
      });
    });

    it("should NOT run on the GET, POST, PUT, DELETE", async () => {
      await userRepository.updateUser(userId, mockedUpdateUser);

      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledTimes(0);
      expect(mockedAxios.post).toHaveBeenCalledTimes(0);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(0);
      expect(mockedAxios.put).toHaveBeenCalledTimes(0);
    });

    it("should update a user on success", async () => {
      const result = await userRepository.updateUser(userId, mockedUpdateUser);

      expect(result).toEqual(ok(true));
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `/users/${userId}`,
        mockedUpdateUser,
        {
          baseURL: process.env.BFF_URL,
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    it("should return an error when the server returns a non-200 status", async () => {
      mockedAxios.patch.mockResolvedValue({ status: 500 });

      const result = await userRepository.updateUser(userId, mockedUpdateUser);

      expect(result).toEqual(
        err("Update user operation is not completed on the server.")
      );
      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
    });

    it("should return an error message from AxiosError", async () => {
      const errorMessage = "Update user operation is not completed on the server.";
      mockedAxios.patch.mockRejectedValue(new AxiosError(errorMessage));

      const result = await userRepository.updateUser(userId, mockedUpdateUser);

      waitFor(() => {
        expect(result).toEqual(err(errorMessage));
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedAxios.post).toHaveBeenCalledWith(`/users/${userId}`);
      });
    });

    it("should return a generic error message for unknown errors", async () => {
      mockedAxios.patch.mockRejectedValue(new Error("Unknown Error"));

      const result = await userRepository.updateUser(userId, mockedUpdateUser);

      expect(result).toEqual(err("Unknown Error"));
      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
    });
  });
});
