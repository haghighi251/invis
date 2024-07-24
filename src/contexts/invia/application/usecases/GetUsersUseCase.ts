import { inject, injectable } from "inversify";
import { IGetUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IGetUser";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { UserRepository } from "@/contexts/invia/domain/services/user.service";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";

@injectable()
export default class GetUserListUseCase implements IGetUserUseCase {
    constructor(@inject(SERVICE_IDENTIFIER.UserRepository) private readonly userRepository: UserRepository) {}

    async execute(): Promise<Nullable<Array<User>>> {

        const result = await this.userRepository.findAll();

        if (result.isErr()) {
            const exception = result.error;

            console.error(`There is a domain error in getting users list.`);
            console.error(`We should convert it to a proper http error and also log it.`);
            console.error(exception);
            
            throw new Error(exception);
        } 

        return result.value;
    }
}