import axios, { AxiosResponseHeaders, AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

import { HttpError } from '@shared/http/HttpError';
import { HttpClient } from '@shared/http/interfaces/HttpClient';

class AxiosClient implements HttpClient {
    private readonly transport: AxiosInstance;

    constructor() {
        this.transport = axios.create({
            withCredentials: true,
            timeout: 35000,
            maxRedirects: 0
        });
    }

    get<ResType>(url: string, options?: AxiosRequestConfig): Promise<ResType> {
        return this.transport
            .get(url, options)
            .then((response: AxiosResponse) => response.data)
            .catch(this.onCatch);
    }

    getWithHeaders<ResType>(url: string, options?: AxiosRequestConfig): Promise<{ headers: AxiosResponseHeaders; data: ResType }> {
        return this.transport
            .get(url, options)
            .then((response: AxiosResponse) => ({ headers: response.headers, data: response.data }))
            .catch(this.onCatch) as Promise<{ headers: AxiosResponseHeaders; data: ResType }>;
    }

    getUri(...params: Parameters<AxiosInstance['getUri']>): ReturnType<AxiosInstance['getUri']> {
        return this.transport.getUri(...params);
    }

    postWithCookies<ResType>(
        url: string,
        body: unknown,
        cookies: Partial<{
            [key: string]: string;
        }>
    ): Promise<{ headers: AxiosResponseHeaders; data: ResType }> {
        return this.transport
            .post(url, body, {
                headers: {
                    ...(Object.keys(cookies).length && {
                        Cookie: ''.concat(
                            ...Object.entries(cookies).map(([key, value]) => {
                                return `${key}=${value};`;
                            })
                        )
                    })
                }
            })
            .then((response: AxiosResponse) => ({
                headers: response.headers,
                data: response.data
            }))
            .catch(this.onCatch) as Promise<{ headers: AxiosResponseHeaders; data: ResType }>;
    }

    post<ResType>(url: string, body?: unknown, options?: AxiosRequestConfig): Promise<ResType> {
        return this.transport
            .post(url, body, options)
            .then((response: AxiosResponse) => response.data)
            .catch(this.onCatch);
    }

    postWithHeaders(url: string, body?: unknown, options?: AxiosRequestConfig) {
        return this.transport
            .post(url, body, options)
            .then((response: AxiosResponse) => {
                return { headers: response.headers, data: response.data };
            })
            .catch(this.onCatch);
    }

    put<ResType>(url: string, body?: unknown, options?: AxiosRequestConfig): Promise<ResType> {
        return this.transport
            .put(url, body, options)
            .then((response: AxiosResponse) => response.data)
            .catch(this.onCatch);
    }

    patch<ResType>(url: string, body?: unknown, options?: AxiosRequestConfig): Promise<ResType> {
        return this.transport
            .patch(url, body, options)
            .then((response: AxiosResponse) => response.data)
            .catch(this.onCatch);
    }

    delete<ResType>(url: string, options?: AxiosRequestConfig): Promise<ResType> {
        return this.transport
            .delete(url, options)
            .then((response: AxiosResponse) => response.data)
            .catch(this.onCatch);
    }

    private onCatch(error: AxiosError) {
        throw new HttpError(error.message || 'An error occurred', {
            stack: error.stack,
            status: error?.response?.status,
            data: error?.response?.data as undefined
        });
    }

    public getTransport() {
        return this.transport;
    }
}

export { AxiosClient };

export const axiosClient = new AxiosClient();
