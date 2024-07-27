import { NextResponse } from "next/server";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { IUpdateUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IUpdateUser";
import { PATCH } from "./route";
import { invisMockedUsers } from "@/__mocks__/invis/users";

jest.mock("@/contexts/invia/infrastructure/inversify/inversify.config");

const handlerProps = {
  params: {
    id: 1,
  },
};

describe("Update USER handler", () => {
  let updateUserUseCase: jest.Mocked<IUpdateUserUseCase>;

  beforeEach(() => {
    updateUserUseCase = {
      execute: jest.fn(),
    };
    (container.get as jest.Mock).mockReturnValue(updateUserUseCase);
    jest.spyOn(NextResponse, "json").mockImplementation((body) => {
      return {
        json: jest.fn().mockResolvedValue(body),
      } as any;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: any) => {
    return new Request("http://localhost", {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });
  };

  it("should return a successful response with data", async () => {
    updateUserUseCase.execute.mockResolvedValue(true);

    const mockRequest = createMockRequest(invisMockedUsers[0]);
    const response = await PATCH(mockRequest, handlerProps);
    const json = await response.json();

    expect(json).toEqual({
      success: true,
      error: "",
      data: null,
    });
    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      userId: handlerProps.params.id,
      user: invisMockedUsers[0],
    });
  });

  it("should return an error response when an error occurs", async () => {
    const mockError = new Error("Test error");
    updateUserUseCase.execute.mockRejectedValue(mockError);

    const mockRequest = createMockRequest(invisMockedUsers[0]);
    const response = await PATCH(mockRequest, handlerProps);
    const json = await response.json();

    expect(json).toEqual({
      success: false,
      error: "Test error",
      data: null,
    });
    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      userId: handlerProps.params.id,
      user: invisMockedUsers[0],
    });
  });

  it("should return a default error message for unknown errors", async () => {
    updateUserUseCase.execute.mockRejectedValue("unknown error");

    const mockRequest = createMockRequest(invisMockedUsers[0]);
    const response = await PATCH(mockRequest, handlerProps);
    const json = await response.json();

    expect(json).toEqual({
      success: false,
      error: "An unexpected error occurred.",
      data: null,
    });
    expect(updateUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      userId: handlerProps.params.id,
      user: invisMockedUsers[0],
    });
  });
});
