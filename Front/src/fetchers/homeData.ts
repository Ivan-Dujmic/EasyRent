import { fetcher } from './fetcher';

export interface OffersResponse {
  offers: ICar[];
}

export interface IDealership {
  companyName: string;
  image: string;
}

export interface ICar {
  image: string;
  companyName: string;
  makeName: string;
  modelName: string;
  noOfSeats?: number; // Changed from string to number to match API response
  automatic?: boolean; // Changed from string to boolean to match API response
  price?: string; // Kept as string to match the API response
  rating?: number;
  noOfReviews?: number;
  offer_id?: number; // Changed from string to number to match API response
}

export interface IShowcased {
  showcased_dealerships: Array<IDealership>;
  most_popular: Array<ICar>;
  best_value: Array<ICar>;
}

export interface IRentals {
  ongoing_rentals: Array<ICar>;
  previously_rented: Array<ICar>;
  unreviewed_rentals: Array<ICar>;
}

export async function getShowCaseds(
  url: string,
  { arg }: { arg?: any } = {}
): Promise<IShowcased> {
  const result = await fetcher<IShowcased>(url, {
    method: 'GET',
  });

  if (result === undefined) {
    throw new Error('Failed to fetch shows');
  }

  return result;
}

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
