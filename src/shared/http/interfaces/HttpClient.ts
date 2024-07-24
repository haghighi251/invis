export interface HttpClient {
    get<ResType>(url: string, options?: unknown): Promise<ResType>;
    post<ResType>(url: string, body?: unknown, options?: unknown): Promise<ResType>;
    delete<ResType>(url: string, options?: unknown): Promise<ResType>;
    patch<ResType>(url: string, body?: unknown, options?: unknown): Promise<ResType>;
    put<ResType>(url: string, body?: unknown, options?: unknown): Promise<ResType>;
}
