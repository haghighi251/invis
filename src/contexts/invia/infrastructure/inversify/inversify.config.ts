import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVICE_IDENTIFIER } from '@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER';
import { UserRepository } from '@/contexts/invia/domain/services/UserRepository';
import GetUserListUseCase from '@/contexts/invia/application/usecases/GetUsersUseCase';
import GetUserDetailsUseCase from '@/contexts/invia/application/usecases/GetUserDetailsUseCase';

const container = new Container();

container.bind<GetUserListUseCase>(SERVICE_IDENTIFIER.GetUserListUseCase).to(GetUserListUseCase);
container.bind<UserRepository>(SERVICE_IDENTIFIER.UserRepository).to(UserRepository);
container.bind<GetUserDetailsUseCase>(SERVICE_IDENTIFIER.GetUserDetailsUseCase).to(GetUserDetailsUseCase);

export { container };