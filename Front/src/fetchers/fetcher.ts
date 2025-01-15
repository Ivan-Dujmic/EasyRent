const getCsrfToken = async () => {
    const response = await fetch('https://your-backend-url.onrender.com/csrf/', {
        credentials: 'include',
    });
    const data = await response.json();
    return data.csrfToken;
};

const sendRequest = async () => {
    const csrfToken = await getCsrfToken();
    await fetch('https://your-backend-url.onrender.com/api/endpoint/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ key: 'value' }),
        credentials: 'include',
    });
};


export async function fetcher<T>(
    input: string | URL | globalThis.Request,
    init?: RequestInit
): Promise<T | undefined> {
    let data: T | undefined;

    try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(input, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRFToken': csrfToken, // !!!Include CSRF token if CSRF is enabled
            },
            credentials: 'include', // Omogućava slanje kolačića za autentifikaciju
            ...init,
        });

        // Provjeravamo je li odgovor uspješan
        if (!response.ok) {
            const errorText = await response.text(); // Pokušaj dobiti detalje o grešci iz odgovora
            throw new Error(`Response status: ${response.status}, ${errorText}`);
        }

        // Provjeravamo je li odgovor prazan (204 No Content)
        const isNoContent = response.status === 204;

        if (!isNoContent) {
            // Čekamo na parsiranje tijela odgovora kao JSON
            data = await response.json();
        }
    } catch (error) {
        // Poboljšano hvatanje greške s više informacija
        console.error('Došlo je do greške tijekom fetch poziva:', error);
        // Ponovno bacamo grešku kako bi je vanjski kod mogao uhvatiti ili obraditi
        throw error;
    }

    // Vraćamo podatke ili undefined ako nije bilo sadržaja - samo tijelo odgovora koje je parsirano, tj pretvorneo je u objekt
    return data;
}
