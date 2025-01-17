import { fetcher } from './fetcher';

export async function CustomGet<T>(
  url: string,
  { arg }: { arg?: any } = {}
): Promise<T> {
  const result = await fetcher<T>(url, {
    method: 'GET',
  });

  if (result === undefined) {
    throw new Error('Failed to fetch');
  }

  return result;
}
