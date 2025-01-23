import { fetcher } from "./fetcher";

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }
    return undefined;
};

export interface ISuccess {
    success: number;
    message: string;
}

export async function CustomDelete<T>(
    url: string,
    { arg }: { arg?: any } = {}
): Promise<ISuccess> {
    const csrfToken: string | undefined = getCookie('csrftoken');
    const response = await fetcher<ISuccess>(url, {
        method: 'DELETE',
        body: arg ? JSON.stringify(arg) : undefined, // Include the body if arguments are provided
        headers: {
            'X-CSRFToken': csrfToken ? csrfToken : undefined, // CSRF token
            'Content-Type': 'application/json', // Content-Type for JSON requests
            ...(arg && { Accept: 'application/json' }), // Accept header if arguments are passed
        },
        credentials: 'include', // Send cookies for authentication (if needed)
    });

    if (response === undefined) {
        throw new Error('Failed to fetch');
    }

    return response;
}
