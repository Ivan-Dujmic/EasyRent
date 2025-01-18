import { IDealership } from "../company/company.type";

export interface IVehicle {
  makeName: string;
  modelName: string;
  image?: string;
  noOfSeats?: string;
  automatic?: string;
}

export interface IOffer extends IVehicle {
  companyName: string;
  price?: number;
  rating?: number;
  noOfReviews?: number;
  offer_id?: string;
}

export interface IReviewable extends IOffer {
  rated: boolean
}

export function toOffer (car: IRentalEntry): IOffer {
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
  most_popular: Array<IOffer>;
  best_value: Array<IOffer>;
}

export interface IRentals {
  ongoing_rentals: Array<IOffer>;
  previously_rented: Array<{car: IOffer, rated: boolean}>;
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