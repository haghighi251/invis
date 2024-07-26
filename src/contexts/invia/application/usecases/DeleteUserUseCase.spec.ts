import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVICE_IDENTIFIER } from '@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER';
import { UserRepository } from '@/contexts/invia/domain/services/UserRepository';
import { err, ok } from 'neverthrow';

import DeleteUserUseCase from './DeleteUserUseCase';

jest.mock('@/contexts/invia/domain/services/UserRepository');

describe('DeleteUserUseCase', () => {
  let container: Container;
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  const userId = 1;

  beforeEach(() => {
    container = new Container();

    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    container.bind<UserRepository>(SERVICE_IDENTIFIER.UserRepository).toConstantValue(userRepository);

    deleteUserUseCase = new DeleteUserUseCase(userRepository);
  });

  it('should return a user on success', async () => {
    userRepository.deleteUserById.mockResolvedValue(ok(true));

    const result = await deleteUserUseCase.execute(userId);

    expect(result).toEqual(true);
    expect(userRepository.deleteUserById).toHaveBeenCalledTimes(1);
    expect(userRepository.deleteUserById).toHaveBeenCalledWith(userId);
  });

  it('should throw an error when UserRepository.findUserById fails', async () => {
    const mockError = 'Test error';
    userRepository.deleteUserById.mockResolvedValue(err(mockError));

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(mockError);
    expect(userRepository.deleteUserById).toHaveBeenCalledTimes(1);
    expect(userRepository.deleteUserById).toHaveBeenCalledWith(userId);
  });

  it('should log the error when UserRepository.findAll fails', async () => {
    const mockError = 'Test error';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    userRepository.deleteUserById.mockResolvedValue(err(mockError));

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(mockError);
  });
});
