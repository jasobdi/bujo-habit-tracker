// Use this for CRUD-Calls 

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    statusCode: number;
}

/**
 * Reusable fetch utility with standardized response & error handling
 *
 * @param endpoint - API endpoint, relative to BACKEND_URL
 * @param options - fetch options (method, headers, body, etc.)
 * @returns {Promise<ApiResponse<T>>} standardized response object
 */
export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const url = `${baseUrl}/${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
            ...options,
        });

        const statusCode = response.status;

        if (!response.ok) {
            const errorText = await response.text();
            return {
                data: null,
                error: `Error ${statusCode}: ${errorText}`,
                statusCode,
            };
        }

        const data = (await response.json()) as T;

        return { data, error: null, statusCode };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            statusCode: 0,
        };
    }
}
