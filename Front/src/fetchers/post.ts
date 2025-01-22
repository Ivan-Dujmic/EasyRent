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

export async function CustomPost<T>(
    url: string,
    { arg }: { arg?: any } = {}
): Promise<ISuccess> {
    const csrfToken: string | undefined = getCookie('csrftoken');
    const response = await fetcher<ISuccess>(url, {
        method: 'POST',
        body: arg ? JSON.stringify(arg) : undefined, // Argumenti se šalju samo ako su dostupni
        headers: {
            'X-CSRFToken': csrfToken ? csrfToken : undefined,
            'Content-Type': 'application/json', // Postavi Content-Type samo ako šalješ JSON
            ...(arg && { Accept: 'application/json' }), // Dodaj Accept header za konzistentnost
        },
        credentials: 'include', // Omogućava slanje kolačića za autentifikaciju
    });

    if (response === undefined) {
        throw new Error('Failed to fetch');
    }

    return response;
}


export async function CustomPut<T>(
    url: string,
    { arg }: { arg?: any } = {}
): Promise<ISuccess> {
    const csrfToken: string | undefined = getCookie('csrftoken');
    const response = await fetcher<ISuccess>(url, {
        method: 'PUT',
        body: arg ? JSON.stringify(arg) : undefined, // Argumenti se šalju samo ako su dostupni
        headers: {
            'X-CSRFToken': csrfToken ? csrfToken : undefined,
            'Content-Type': 'application/json', // Postavi Content-Type samo ako šalješ JSON
            ...(arg && { Accept: 'application/json' }), // Dodaj Accept header za konzistentnost
        },
        credentials: 'include', // Omogućava slanje kolačića za autentifikaciju
    });

    if (response === undefined) {
        throw new Error('Failed to fetch');
    }

    return response;
}