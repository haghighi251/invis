/*
 * Use cases exist for following purposes:
 * - request and response typing
 * - complexity abstraction if more than one service or use case call is required
 * - singleton implementation for service calls
 **/
export interface UseCase<IRequest, IResponse> {
    execute(req?: IRequest): IResponse;
}
