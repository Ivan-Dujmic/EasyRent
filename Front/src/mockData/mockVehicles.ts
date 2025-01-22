import { ICar } from "@/typings/vehicles/vehicles.type";

export const mockVehicles0: ICar[] = [
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/04_premium.png?height=116',
    companyName: 'Enterprise Rent-A-Car',
    makeName: 'Mercedes-Benz 1',
    modelName: 'A-Class',
    noOfSeats: 5,
    automatic: true,
    price: '183', // USD
    rating: 5,
    noOfReviews: 2,
    offer_id: '1',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/01_mini_white.png?height=116',
    companyName: 'Budget',
    makeName: 'Volkswagen 1',
    modelName: 'up!',
    noOfSeats: 5,
    automatic: false,
    price: '38', // USD
    rating: 5,
    noOfReviews: 2,
    offer_id: '2',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/05_suv-small_white.png?height=116',
    companyName: 'Payless',
    makeName: 'Volkswagen 1',
    modelName: 'T-Cross',
    noOfSeats: 5,
    automatic: false,
    price: '47', // USD
    rating: 5,
    noOfReviews: 3,
    offer_id: '3',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/06_suv-medium_white.png?height=116',
    companyName: 'National',
    makeName: 'Mazda 1',
    modelName: 'CX-5',
    noOfSeats: 5,
    automatic: true,
    price: '241', // USD
    rating: 4,
    noOfReviews: 4,
    offer_id: '4',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/05_suv-small_black.png?height=116',
    companyName: 'Budget',
    makeName: 'Volkswagen 1',
    modelName: 'Taigo',
    noOfSeats: 5,
    automatic: false,
    price: '53', // USD
    rating: 5,
    noOfReviews: 3,
    offer_id: '5',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/06_suv-medium_warmgrey.png?height=116',
    companyName: 'Budget',
    makeName: 'Volkswagen 1',
    modelName: 'Tiguan',
    noOfSeats: 5,
    automatic: true,
    price: '210', // USD
    rating: 5,
    noOfReviews: 4,
    offer_id: '6',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/05_suv-small_white.png?height=116',
    companyName: 'SURPRICE CAR RENTAL',
    makeName: 'Nissan 1',
    modelName: 'Qashqai',
    noOfSeats: 5,
    automatic: true,
    price: '88', // USD
    rating: 5,
    noOfReviews: 2,
    offer_id: '7',
  },
  {
    image:
      'https://content.r9cdn.net/rimg/car-images/generic/07_suv-large_white.png?height=116',
    companyName: 'Alamo',
    makeName: 'Land Rover 1',
    modelName: 'Discovery Sport',
    noOfSeats: 5,
    automatic: true,
    price: '549', // USD
    rating: 5,
    noOfReviews: 3,
    offer_id: '8',
  },
];

export const mockVehicles: ICar[] = [
  ...Array.from({ length: 48 }, (_, index) => {
    const baseVehicle = mockVehicles0[Math.floor(Math.random() * 8)];
    return {
      ...baseVehicle,
      makeName: `${baseVehicle.makeName.split(' ')[0]} ${Math.ceil((index + 1) / 8)}`,
      modelName: `${baseVehicle.modelName} Copy ${index + 1}`,
      offer_id: `${index + 9}`,
    };
  }),
];
