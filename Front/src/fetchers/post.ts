export async function CustomPost<T>(
  url: string,
  { arg }: { arg?: any } = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    body: arg ? JSON.stringify(arg) : undefined, // Argumenti se šalju samo ako su dostupni
    headers: {
      'Content-Type': 'application/json', // Postavi Content-Type samo ako šalješ JSON
      ...(arg && { Accept: 'application/json' }), // Dodaj Accept header za konzistentnost
    },
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
