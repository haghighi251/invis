import { UseCase } from "@/shared/interfaces/UseCase";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";


export type IAddUserUseCase = UseCase<User, Promise<Nullable<boolean>>>;
