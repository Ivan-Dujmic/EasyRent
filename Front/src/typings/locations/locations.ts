export interface Location {
  companyName?: string;
  dealership_id: number;
  streetName: string;
  streetNo: string;
  cityName: string;
  latitude: string;
  longitude: string;
  location_id: number;
  isHQ?: boolean;
}

export interface ILocation {
  streetName: string;
  streetNo: string;
  cityName: string;
  countryName: string;
  locationId: number;
}

export interface ILocationDetails {
  latitude: number;
  longitude: number;
  streetName: string;
  streetNo: string;
  cityName: string;
  workingHours: [
    {
      dayOfTheWeek: number;
      startTime: string;
      endTime: string;
    }
  ]
}

export interface ExtraLocationInfo extends Location {
  availableCars?: number;
  workingHours?: string;
}

export interface LocationsResponse {
  locations: ExtraLocationInfo[];
}
