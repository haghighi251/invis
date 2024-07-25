import { isSSR, isTest } from "@/infrastructure/environment/environment";

export const getCacheTimeDefault1Minute = () => (isTest() ? 0 : isSSR() ? Infinity : 60000);
export const getCacheTimeDefault5Minutes = () => (isTest() ? 0 : isSSR() ? Infinity : 5 * 60 * 1000);

export const getCacheTimeDefault24Hour = () => (isTest() ? 0 : isSSR() ? Infinity : 1000 * 60 * 60 * 24);
