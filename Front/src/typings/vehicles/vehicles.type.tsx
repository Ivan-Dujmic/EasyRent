import { ICar } from '@/fetchers/homeData';
import { IDealership } from '../company/company';

export interface IReviewable extends ICar {
  rated: boolean;
}

export function toOffer(car: IRentalEntry): ICar {
  return {
    image: car.image,
    companyName: car.companyName,
    makeName: car.makeName.toString(),
    modelName: car.modelName.toString(),
    noOfSeats: car.noOfSeats,
    automatic: car.automatic,
    price: car.price.toString(),
    rating: car.rating,
    noOfReviews: car.noOfReviews,
    offer_id: car.offer_id.toString(),
  };
}

export interface IShowcased {
  showcased_dealerships: Array<IDealership>;
  most_popular: Array<ICar>;
  best_value: Array<ICar>;
}

export interface IRentals {
  ongoing_rentals: Array<ICar>;
  previously_rented: Array<{ car: ICar; rated: boolean }>;
}

export interface IRentalEntry {
  makeName: string;
  modelName: string;
  companyName: string;
  noOfSeats: number;
  automatic: boolean;
  price: number;
  rating: number;
  noOfReviews: number;
  dateTimeRented: string;
  dateTimeReturned: string;
  expired: boolean;
  canReview: boolean;
  offer_id: number;
  image: string;
}
