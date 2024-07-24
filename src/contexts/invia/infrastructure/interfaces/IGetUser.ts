import { UseCase } from "@/shared/interfaces/UseCase";
import { Nullable } from "@/contexts/shared/domain/entities/Nullable";
import { User } from "@/shared/types/invis/UserSchema";


export type IGetUserUseCase = UseCase<null, Promise<Nullable<Array<User>>>>;
