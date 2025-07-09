import { fetchApi } from "./fetchApi";

export const fetcher = (url: string, token: string) =>
    fetchApi(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        cache: "no-store",
    }).then((res) => res.data);
