import { NextResponse } from "next/server";
import { container } from "@/contexts/invia/infrastructure/inversify/inversify.config";
import { GET } from "./route";
import { invisMockedUsers } from "@/__mocks__/invis/users";
import { IGetUserDetails } from "@/contexts/invia/infrastructure/interfaces/IGetUserDetails";

jest.mock("@/contexts/invia/infrastructure/inversify/inversify.config");

const handlerProps = {
  params: {
    id: 1,
  },
};

const mockRequest = new Request("http://localhost");

describe("GET handler", () => {
  let getUserDetailsUseCase: jest.Mocked<IGetUserDetails>;
  getUserDetailsUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    (container.get as jest.Mock).mockReturnValue(getUserDetailsUseCase);
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
    getUserDetailsUseCase.execute.mockResolvedValue(invisMockedUsers[0]);

    const response = await GET(mockRequest, handlerProps);
    const json = await response.json();
    
    expect(json).toEqual({
      success: true,
      error: "",
      data: invisMockedUsers[0],
    });
    expect(getUserDetailsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getUserDetailsUseCase.execute).toHaveBeenCalledWith(handlerProps.params.id);
  });

  it("should return an error response when an error occurs", async () => {
    const mockError = new Error("Test error");
    getUserDetailsUseCase.execute.mockRejectedValue(mockError);

    const response = await GET(mockRequest, handlerProps);

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: "Test error",
      data: null,
    });
    expect(getUserDetailsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getUserDetailsUseCase.execute).toHaveBeenCalledWith(handlerProps.params.id);
  });

  it("should return a default error message for unknown errors", async () => {
    getUserDetailsUseCase.execute.mockRejectedValue("unknown error");

    const response = await GET(mockRequest, handlerProps);

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: "An unexpected error occurred.",
      data: null,
    });
    expect(getUserDetailsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getUserDetailsUseCase.execute).toHaveBeenCalledWith(handlerProps.params.id);
  });
});
