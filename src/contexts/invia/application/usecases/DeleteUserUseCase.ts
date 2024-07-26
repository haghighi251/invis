import { inject, injectable } from "inversify";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { UserRepository } from "@/contexts/invia/domain/services/UserRepository";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { IDeleteUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IDeleteUser";

@injectable()
export default class DeleteUserUseCase implements IDeleteUserUseCase {
    constructor(@inject(SERVICE_IDENTIFIER.UserRepository) private readonly userRepository: UserRepository) {}

    async execute(userId: number): Promise<Nullable<boolean>> {

        const result = await this.userRepository.deleteUserById(userId);

        if (result.isErr()) {
            const exception = result.error;

            console.error(`There is a domain error in deleting a user details.`);
            console.error(`We should convert it to a proper http error and also log it.`);
            console.error(exception);
            
            throw new Error(exception);
        } 

        return result.value;
    }
}