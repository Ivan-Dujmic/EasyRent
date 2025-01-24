export interface IReview
{
    image: string,
    makeName: string,
    modelName: string,
    registration: string,
    vehicleId: number,
    firstName: string,
    lastName: string,
    ratings: number,
    descriptions: string
  }

export interface ILogReview {
    firstName: string,
    lastName: string,
    date: string,
    description: string,
    ratings: number
}