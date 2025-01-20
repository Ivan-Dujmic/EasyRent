const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
    }
    return undefined;
};
export async function CustomPost<T>(
    url: string,
    { arg }: { arg?: any } = {}
): Promise<T> {
    const csrfToken: string | undefined = getCookie('csrftoken');
    const response = await fetch(url, {
        method: 'POST',
        body: arg ? JSON.stringify(arg) : undefined, // Argumenti se šalju samo ako su dostupni
        headers: {
            'X-CSRFToken': csrfToken ? csrfToken : undefined,
            'Content-Type': 'application/json', // Postavi Content-Type samo ako šalješ JSON
            ...(arg && { Accept: 'application/json' }), // Dodaj Accept header za konzistentnost
        },
        credentials: 'include', // Omogućava slanje kolačića za autentifikaciju
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    try {
        return await response.json(); // Pokušaj parsirati JSON odgovor
    } catch {
        return {} as T; // Ako odgovor nije JSON, vrati prazan objekt odgovarajućeg tipa
    }
}
