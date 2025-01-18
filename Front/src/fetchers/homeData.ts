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
  noOfSeats?: number; // Number of seats
  automatic?: boolean; // Automatic or manual
  price?: string; // Price as a string
  rating?: number; // Rating value
  noOfReviews?: number; // Number of reviews
  offer_id?: string;
}

// Extended interface for offers
export interface IOffer extends ICar {
  dealership_id: number; // ID of the dealership
  modelType: string; // Model type (e.g., SUV)
  description?: string; // Description of the offer
  companyLogo?: string;
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
