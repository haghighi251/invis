import { IUpdateUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IUpdateUser";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { APIResponse } from "@/shared/types/APIResponse";
import { PartialUserSchema } from "@/shared/types/invis/UpdateUserSchema";
import { User, UserSchema } from "@/shared/types/invis/UserSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const UserIDSchema = UserSchema.shape.id;

export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
): Promise<NextResponse<APIResponse>> {
  try {
    const userId = Number(params.id);
    UserIDSchema.parse(userId);

    const body = await request.json();
    PartialUserSchema.parse(body);

    const user: Partial<User> = body;

    const updateUserUseCase = container.get<IUpdateUserUseCase>(
      SERVICE_IDENTIFIER.UpdateUserUseCase
    );
    await updateUserUseCase.execute({userId, user});

    return NextResponse.json({
      success: true,
      error: "",
      data: null,
    });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (error instanceof ZodError) {
      errorMessage = error.errors.map(err => err.message).join(", ");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: null,
    });
  }
}
