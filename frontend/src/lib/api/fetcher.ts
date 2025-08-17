import { fetchApi } from "./fetchApi";

/**
 * fetcher function for GET requests to the API
 * 
 * @param url - API endpoint
 * @param token - Authentication (Bearer) token to include in the request headers
 * @returns The parsed JSON response from the API
 */

export const fetcher = (url: string, token: string) =>
    fetchApi(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    }).then((res) => res.data);
