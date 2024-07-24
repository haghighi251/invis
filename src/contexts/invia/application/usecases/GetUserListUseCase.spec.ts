import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVICE_IDENTIFIER } from '@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER';
import { UserRepository } from '@/contexts/invia/domain/services/user.service';
import { User } from '@/shared/types/invis/UserSchema';
import { err, ok, Result } from 'neverthrow';
import GetUserListUseCase from './GetUsersUseCase';
import { invisMockedUsers } from '@/__mocks__/invis/users';

jest.mock('@/contexts/invia/domain/services/user.service');

describe('GetUserListUseCase', () => {
  let container: Container;
  let getUserListUseCase: GetUserListUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    container = new Container();

    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    container.bind<UserRepository>(SERVICE_IDENTIFIER.UserRepository).toConstantValue(userRepository);

    getUserListUseCase = new GetUserListUseCase(userRepository);
  });

  it('should return a list of users on success', async () => {
    userRepository.findAll.mockResolvedValue(ok(invisMockedUsers));

    const result = await getUserListUseCase.execute();

    expect(result).toEqual(invisMockedUsers);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when UserRepository.findAll fails', async () => {
    const mockError = 'Test error';
    userRepository.findAll.mockResolvedValue(err(mockError));

    await expect(getUserListUseCase.execute()).rejects.toThrow(mockError);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should log the error when UserRepository.findAll fails', async () => {
    const mockError = 'Test error';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    userRepository.findAll.mockResolvedValue(err(mockError));

    await expect(getUserListUseCase.execute()).rejects.toThrow(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('There is a domain error in getting users list.');
    expect(consoleErrorSpy).toHaveBeenCalledWith('We should convert it to a proper http error and also log it.');
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    consoleErrorSpy.mockRestore();
  });
});
