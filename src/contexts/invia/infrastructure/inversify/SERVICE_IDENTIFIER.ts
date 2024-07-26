const SERVICE_IDENTIFIER = {
    GetUserListUseCase: Symbol.for('GetUserListUseCase'),
    UserRepository: Symbol.for('UserRepository'),
    GetUserDetailsUseCase: Symbol.for('GetUserDetailsUseCase'),
    DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
    AddUserUseCase: Symbol.for('AddUserUseCase'),
};

export { SERVICE_IDENTIFIER };
