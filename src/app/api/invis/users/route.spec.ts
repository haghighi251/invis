import { NextResponse } from 'next/server';
import { container } from '@/contexts/invia/infrastructure/inversify/inversify.config';
import { GET } from './route';
import { IGetUserUseCase } from '@/contexts/invia/infrastructure/interfaces/IGetUser';
import { invisMockedUsers } from '@/__mocks__/invis/users';

jest.mock('@/contexts/invia/infrastructure/inversify/inversify.config');

describe('GET handler', () => {
  let getUsersUseCase: jest.Mocked<IGetUserUseCase>;
  getUsersUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    (container.get as jest.Mock).mockReturnValue(getUsersUseCase);
    jest.spyOn(NextResponse, 'json').mockImplementation((body) => {
      return {
        json: jest.fn().mockResolvedValue(body)
      } as any;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a successful response with data', async () => {
    getUsersUseCase.execute.mockResolvedValue(invisMockedUsers);

    const response = await GET();

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: true,
      error: "",
      data: invisMockedUsers,
    });
    expect(getUsersUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should return an error response when an error occurs', async () => {
    const mockError = new Error('Test error');
    getUsersUseCase.execute.mockRejectedValue(mockError);

    const response = await GET();

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: 'Test error',
      data: null,
    });
    expect(getUsersUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should return a default error message for unknown errors', async () => {
    getUsersUseCase.execute.mockRejectedValue('unknown error');

    const response = await GET();

    expect(response).toBeInstanceOf(Object);
    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: 'An unexpected error occurred.',
      data: null,
    });
    expect(getUsersUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
