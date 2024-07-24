import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVICE_IDENTIFIER } from '@/contexts/invia/infrastructure/inversify/SERVICE_IDENTIFIER';
import { UserRepository } from '@/contexts/invia/domain/services/user.service';
import GetUserListUseCase from '@/contexts/invia/application/usecases/GetUsersUseCase';

const container = new Container();

container.bind<GetUserListUseCase>(SERVICE_IDENTIFIER.GetUserListUseCase).to(GetUserListUseCase);
container.bind<UserRepository>(SERVICE_IDENTIFIER.UserRepository).to(UserRepository);

export { container };