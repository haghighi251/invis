// https://nextjs.org/docs/messages/non-standard-node-env
// Setting a non-standard NODE_ENV value may cause dependencies to behave unexpectedly, or worse, break dead code elimination.
import getConfig from 'next/config';

export const isProd = (): boolean => {
    return 'production' === process.env.NODE_ENV;
};

export const isDev = (): boolean => {
    return 'development' === process.env.NODE_ENV;
};

export const isSSR = (): boolean => {
    return typeof window === 'undefined';
};

export const isTest = (): boolean => {
    return 'test' === process.env.NODE_ENV;
};

export const getEnv = (): string => {
    const config = getConfig();

    return process.env.NEXT_PUBLIC_ENV || config?.publicRuntimeConfig?.nextPublicEnv || 'local';
};

export const isLocal = (): boolean => {
    return getEnv() === 'local';
};
