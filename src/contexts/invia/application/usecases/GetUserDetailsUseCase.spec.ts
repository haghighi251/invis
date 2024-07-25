import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVICE_IDENTIFIER } from '@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER';
import { UserRepository } from '@/contexts/invia/domain/services/UserRepository';
import { User } from '@/shared/types/invis/UserSchema';
import { err, ok, Result } from 'neverthrow';

import { invisMockedUsers } from '@/__mocks__/invis/users';
import GetUserDetailsUseCase from './GetUserDetailsUseCase';

jest.mock('@/contexts/invia/domain/services/UserRepository');

describe('GetUserListUseCase', () => {
  let container: Container;
  let getUserDetailsUseCase: GetUserDetailsUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  const userId = 1;

  beforeEach(() => {
    container = new Container();

    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    container.bind<UserRepository>(SERVICE_IDENTIFIER.UserRepository).toConstantValue(userRepository);

    getUserDetailsUseCase = new GetUserDetailsUseCase(userRepository);
  });

  it('should return a user on success', async () => {
    userRepository.findUserById.mockResolvedValue(ok(invisMockedUsers[0]));

    const result = await getUserDetailsUseCase.execute(userId);

    expect(result).toEqual(invisMockedUsers[0]);
    expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
  });

  it('should throw an error when UserRepository.findUserById fails', async () => {
    const mockError = 'Test error';
    userRepository.findUserById.mockResolvedValue(err(mockError));

    await expect(getUserDetailsUseCase.execute(userId)).rejects.toThrow(mockError);
    expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
  });

  it('should log the error when UserRepository.findAll fails', async () => {
    const mockError = 'Test error';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    userRepository.findUserById.mockResolvedValue(err(mockError));

    await expect(getUserDetailsUseCase.execute(userId)).rejects.toThrow(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('There is a domain error in getting user details.');
    expect(consoleErrorSpy).toHaveBeenCalledWith('We should convert it to a proper http error and also log it.');
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    consoleErrorSpy.mockRestore();
  });
});
