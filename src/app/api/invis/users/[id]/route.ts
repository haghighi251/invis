import { IGetUserDetails } from "@/contexts/invia/infrastructure/interfaces/IGetUserDetails";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { APIResponse } from "@/shared/types/APIResponse";
import { UserSchema } from "@/shared/types/invis/UserSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const UserIDSchema = UserSchema.shape.id;

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
): Promise<NextResponse<APIResponse>> {
  try {
    const userId = Number(params.id);
    UserIDSchema.parse(userId);

    const getUserDetailsUseCase = container.get<IGetUserDetails>(
      SERVICE_IDENTIFIER.GetUserDetailsUseCase
    );
    const result = await getUserDetailsUseCase.execute(userId);

    return NextResponse.json({
      success: true,
      error: "",
      data: result,
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
