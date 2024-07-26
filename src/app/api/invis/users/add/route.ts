import { IAddUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IAddUser";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { APIResponse } from "@/shared/types/APIResponse";
import { User, UserSchema } from "@/shared/types/invis/UserSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(
  request: Request,
): Promise<NextResponse<APIResponse>> {
  try {
    const body = await request.json();
    UserSchema.parse(body);

    const user: User = body;

    const addUserUseCase = container.get<IAddUserUseCase>(
      SERVICE_IDENTIFIER.AddUserUseCase
    );
    await addUserUseCase.execute(user);

    return NextResponse.json({
      success: true,
      error: "",
      data: null,
    });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof ZodError)
      errorMessage = error.errors[0].message;

    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: null,
    });
  }
}
