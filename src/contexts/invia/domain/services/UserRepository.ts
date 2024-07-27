import { User } from "@/shared/types/invis/UserSchema";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { injectable } from "inversify";
import { err, ok, Result } from "neverthrow";

@injectable()
export class UserRepository {
  private config: AxiosRequestConfig;

  constructor() {
    if (!process.env.BFF_URL) {
      throw new Error("BFF_URL environment variable is not defined.");
    }

    const timeout = Number(process.env.REQUEST_TIMEOUT) || 5000;

    this.config = {
      baseURL: process.env.BFF_URL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  async findAll(): Promise<Result<Array<User>, string>> {
    try {
      const result = await axios.get("/users", this.config);

      if (result.status !== 200)
        return err("Data is not fetched from the server.");

      const users: Array<User> = result.data;

      return ok(users);
    } catch (error) {
      let errorMessage = "Something crashed on the server!";

      if (error instanceof AxiosError || error instanceof Error)
        errorMessage = error.message;

      return err(errorMessage);
    }
  }

  async findUserById(userId: number): Promise<Result<User, string>> {
    try {
      const result = await axios.get(`/users/${userId}`, this.config);

      if (result.status !== 200)
        return err("Data is not fetched from the server.");

      const user: User = result.data;

      return ok(user);
    } catch (error) {
      let errorMessage = "Something crashed on the server!";

      if (error instanceof AxiosError || error instanceof Error)
        errorMessage = error.message;

      return err(errorMessage);
    }
  }

  async deleteUserById(userId: number): Promise<Result<true, string>> {
    try {
      const result = await axios.delete(`/users/${userId}`, this.config);

      if (result.status !== 200)
        return err("Delete operation is not completed on the server.");

      const user: User = result.data;

      return ok(true);
    } catch (error) {
      let errorMessage = "Something crashed on the server!";

      if (error instanceof AxiosError || error instanceof Error)
        errorMessage = error.message;

      return err(errorMessage);
    }
  }

  async addNewUser(user: User): Promise<Result<true, string>> {
    const userData = user;
    try {
      const url = "/users";

      const result = await axios.post(url, userData, this.config);

      if (result.status !== 201)
        return err("Add new user operation is not completed on the server.");

      return ok(true);
    } catch (error) {
      let errorMessage = "Something crashed on the server!";

      if (error instanceof AxiosError || error instanceof Error)
        errorMessage = error.message;

      return err(errorMessage);
    }
  }

  async updateUser(userId: number, user: Partial<User>): Promise<Result<true, string>> {
    const userData = user;
    try {
      const url = `/users/${userId}`;

      const result = await axios.patch(url, userData, this.config);

      if (result.status !== 200)
        return err("Update user operation is not completed on the server.");

      return ok(true);
    } catch (error) {
      let errorMessage = "Something crashed on the server!";

      if (error instanceof AxiosError || error instanceof Error)
        errorMessage = error.message;

      return err(errorMessage);
    }
  }
}
