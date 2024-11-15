import { fetcher } from './fetcher';

export interface IDealership {
  companyName: string;
  image: string;
}

export interface ICar {
  image: string;
  companyName: string;
  modelName: string;
  makeName: string;
  noOfSeats: string;
  automatic: string;
  price: string;
  rating: string;
  noOfReviews: string;
}

export interface IShowcased {
  showcased_dealerships: Array<IDealership>;
  most_popular: Array<ICar>;
  best_value: Array<ICar>;
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
