import { UseCase } from "@/shared/interfaces/UseCase";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";

export type UpdateUserInputRequest = {
    userId: number;
    user: Partial<User>;
}

export type IUpdateUserUseCase = UseCase<UpdateUserInputRequest, Promise<Nullable<boolean>>>;
