import { NextResponse } from "next/server";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { DELETE } from "./route";
import { IDeleteUserUseCase } from "@/contexts/invia/infrastructure/interfaces/IDeleteUser";

jest.mock("@/contexts/invia/infrastructure/inversify/inversify.config");

const handlerProps = {
  params: {
    id: 1,
  },
};

const mockRequest = new Request("http://localhost");

describe("DELETE handler", () => {
  let deleteUserUseCase: jest.Mocked<IDeleteUserUseCase>;
  deleteUserUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    (container.get as jest.Mock).mockReturnValue(deleteUserUseCase);
    jest.spyOn(NextResponse, "json").mockImplementation((body) => {
      return {
        json: jest.fn().mockResolvedValue(body),
      } as any;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a successful response with data", async () => {
    deleteUserUseCase.execute.mockResolvedValue(true);

    const response = await DELETE(mockRequest, handlerProps);
    const json = await response.json();
    
    expect(json).toEqual({
      success: true,
      error: "",
      data: null,
    });
    expect(deleteUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(handlerProps.params.id);
  });

  it("should return an error response when an error occurs", async () => {
    const mockError = new Error("Test error");
    deleteUserUseCase.execute.mockRejectedValue(mockError);

    const response = await DELETE(mockRequest, handlerProps);

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: "Test error",
      data: null,
    });
    expect(deleteUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(handlerProps.params.id);
  });

  it("should return a default error message for unknown errors", async () => {
    deleteUserUseCase.execute.mockRejectedValue("unknown error");

    const response = await DELETE(mockRequest, handlerProps);

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: "An unexpected error occurred.",
      data: null,
    });
    expect(deleteUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(deleteUserUseCase.execute).toHaveBeenCalledWith(handlerProps.params.id);
  });
});
