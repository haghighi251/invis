import { IGetUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IGetUser";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { SERVICE_IDENTIFIER } from "@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER";
import { APIResponse } from "@/shared/types/APIResponse";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<APIResponse>> {
  try {
    const getUsersUseCase = container.get<IGetUserUseCase>(
      SERVICE_IDENTIFIER.GetUserListUseCase
    );
    const result = await getUsersUseCase.execute();

    return NextResponse.json({
      success: true,
      error: "",
      data: result,
    });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: null,
    });
  }
}
