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
  registration: string;
}

export interface ILog {
  
  image: string;
  companyName: string;
  modelName: string;
  makeName: string;
  customerName: string;
  customerSurname: string;
  price: string;
  registration: string;
  pickupp: string;
  dropoff: string;
}

export interface IReview{  
  companyName: string;
  modelName: string;
  makeName: string;
  customerName: string;
  customerSurname: string;
  registration: string;
  date: string;
  description: string;
  rating: string;
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

export async function get<T>(
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
