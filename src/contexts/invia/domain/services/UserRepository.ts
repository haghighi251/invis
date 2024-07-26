import { User } from "@/shared/types/invis/UserSchema";
import axios, { AxiosError } from "axios";
import { injectable } from "inversify";
import { err, ok, Result } from "neverthrow";

@injectable()
export class UserRepository {
  async findAll(): Promise<Result<Array<User>, string>> {
    try {
      if (!process.env.BFF_URL) {
        throw new Error("BFF_URL environment variable is not defined.");
      }
      const result = await axios.get("/users", {
        baseURL: process.env.BFF_URL,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      if (!process.env.BFF_URL) {
        throw new Error("BFF_URL environment variable is not defined.");
      }
      const result = await axios.get(`/users/${userId}`, {
        baseURL: process.env.BFF_URL,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      if (!process.env.BFF_URL) {
        throw new Error("BFF_URL environment variable is not defined.");
      }
      const result = await axios.delete(`/users/${userId}`, {
        baseURL: process.env.BFF_URL,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

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


}
