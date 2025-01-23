
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
    rent_id: car.rent_id.toString(),
  };
}

export interface ICar {
  // dode isto kao i I offer prije koji je nasljedi IVechile
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
  rent_id?: string
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
  rent_id: number;
}

export interface IPage {
  page: number;
  data: IRentalEntry;
}
