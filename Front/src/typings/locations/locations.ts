export interface Location {
  companyName: string;
  dealership_id: number;
  streetName: string;
  streetNo: string;
  cityName: string;
  latitude: string;
  longitude: string;
  location_id: number;
}

export interface ExtraLocationInfo extends Location {
  availableCars?: number;
  workingHours?: string;
}

export interface LocationsResponse {
  locations: ExtraLocationInfo[];
}
