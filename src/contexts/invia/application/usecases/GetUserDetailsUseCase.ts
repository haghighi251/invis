import { inject, injectable } from "inversify";
import { IGetUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IGetUser";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { UserRepository } from "@/contexts/invia/domain/services/UserRepository";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";
import { IGetUserDetails } from "@/contexts/invia/infrastructure/interfaces/IGetUserDetails";

@injectable()
export default class GetUserDetailsUseCase implements IGetUserDetails {
    constructor(@inject(SERVICE_IDENTIFIER.UserRepository) private readonly userRepository: UserRepository) {}

    async execute(userId: number): Promise<Nullable<User>> {

        const result = await this.userRepository.findUserById(userId);

        if (result.isErr()) {
            const exception = result.error;

            console.error(`There is a domain error in getting user details.`);
            console.error(`We should convert it to a proper http error and also log it.`);
            console.error(exception);
            
            throw new Error(exception);
        } 

        return result.value;
    }
}