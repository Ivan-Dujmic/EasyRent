export interface ICarModel {
  modelName: string;
  model_id: number;
}

export interface ICarMake {
  makeName: string;
  models: ICarModel[];
}

export interface CarMakesResponse {
  makes: ICarMake[];
}
