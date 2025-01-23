import { useRef, useEffect } from "react";

interface AddressAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function AddressAutocomplete({ onPlaceSelect }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onPlaceSelect(place);
    });
  }, []);

  return <input ref={inputRef} type="text" placeholder="Enter address..." style={{ width: "100%", padding: "8px" }} />;
}
