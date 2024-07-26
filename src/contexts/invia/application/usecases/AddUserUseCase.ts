import { inject, injectable } from "inversify";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { UserRepository } from "@/contexts/invia/domain/services/UserRepository";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";
import { IAddUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IAddUser";

@injectable()
export default class AddUserUseCase implements IAddUserUseCase {
    constructor(@inject(SERVICE_IDENTIFIER.UserRepository) private readonly userRepository: UserRepository) {}

    async execute(user: User): Promise<Nullable<boolean>> {

        const result = await this.userRepository.addNewUser(user);

        if (result.isErr()) {
            const exception = result.error;

            console.error(`There is a domain error in adding a new user.`);
            console.error(`We should convert it to a proper http error and also log it.`);
            console.error(exception);
            
            throw new Error(exception);
        } 

        return result.value;
    }
}