import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

export const createWrapper = () => {
    const mutationCache = new MutationCache();
    const queryCache = new QueryCache();
    const queryClient = new QueryClient({
        queryCache: queryCache,
        mutationCache: mutationCache,
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            }
        }
    });

    const Wrapper = ({ children }: { children: ReactNode }) => {
        useEffect(() => {
            return () => {
                queryClient.clear();
                queryCache.clear();
                mutationCache.clear();
            };
        });

        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };

    return {
        wrapper: Wrapper,
        queryClient
    };
};
