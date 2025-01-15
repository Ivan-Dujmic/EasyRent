export interface LocationDDMProps {
  options: { [key: string]: string[] };
  description: string;
  placeHolder: string;
  onLocationChange: (value: string) => void;
}
