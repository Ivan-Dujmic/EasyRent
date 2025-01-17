import { IDealership } from "../company/company.type";

export interface ICar {
  image: string;
  companyName: string;
  makeName: string;
  modelName: string;
  noOfSeats?: string;
  automatic?: string;
  price?: number;
  rating?: number;
  noOfReviews?: number;
  offer_id?: string;
}

export function toCar (car: IRentalEntries): ICar {
  return {
    image: car.image,
    companyName: car.companyName,
    makeName: car.makeName.toString(),
    modelName: car.modelName.toString(),
    noOfSeats: car.noOfSeats.toString(),
    automatic: car.automatic.toString(),
    price: car.price,
    rating: car.rating,
    noOfReviews: car.noOfReviews,
    offer_id: car.offer_id.toString()
  }
}

export interface IShowcased {
  showcased_dealerships: Array<IDealership>;
  most_popular: Array<ICar>;
  best_value: Array<ICar>;
}

export interface IRentals {
  ongoing_rentals: Array<ICar>;
  previously_rented: Array<{car: ICar, rated: boolean}>;
}

export interface IRentalEntries {
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