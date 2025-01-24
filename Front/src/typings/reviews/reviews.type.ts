export interface IReview
{
    image: string,
    makeName: string,
    modelName: string,
    registration: string,
    vehicleId: number,
    firstName: string,
    lastName: string,
    rating: number,
    descriptions: string
  }

export interface ILogReview {
    firstName: string,
    lastName: string,
    date: string,
    description: string,
    rating: number
}