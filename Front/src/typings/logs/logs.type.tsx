export interface ILog {
    makeName: string,
    modelName: string,
    registration: string,
    vehicleId: number,
    firstName: string,
    lastName: string,
    noOfReviews: number,
    dateTimePickup: string,
    dateTimeReturned: string,
    image: string
}

export interface IVehicleLog
{
    makeName: string,
    modelName: string,
    registration: string,
    streetName: string,
    streetNo: string,
    cityName: string,
    timesRented: number,
    moneyMade: number,
    rentedTime: string,
    onGoing: [
      {
        pickUpDateTime: string,
        dropOffDateTime: string,
        firstName: string,
        lastName: string,
        price: number,
        pickUpLocationId: number,
        dropOffLocationId: number,
        pickUpLocation: string,
        dropOffLocation: string
      }
    ]
  }

export interface IVehicleLogs  {
    dateTimePickup: string,
    dateTimeReturned: string,
    firstName: string,
    lastName: string,
    price: number,
    pickUpLocation: string,
    dropOffLocation: string
}