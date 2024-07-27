import { inject, injectable } from "inversify";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { UserRepository } from "@/contexts/invia/domain/services/UserRepository";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";
import { IUpdateUserUseCase, UpdateUserInputRequest } from "@/contexts/invia/infrastructure/interfaces/IUpdateUser";

@injectable()
export default class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    @inject(SERVICE_IDENTIFIER.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async execute(req: UpdateUserInputRequest): Promise<Nullable<boolean>> {
    const result = await this.userRepository.updateUser(req.userId, req.user);

    if (result.isErr()) {
      const exception = result.error;

      console.error(`There is a domain error in updating a user.`);
      console.error(
        `We should convert it to a proper http error and also log it.`
      );
      console.error(exception);

      throw new Error(exception);
    }

    return result.value;
  }
}
