import { Box, MenuGroup, MenuItem, useBreakpointValue } from '@chakra-ui/react';
import { FaCity } from 'react-icons/fa';
// import { MdLocalAirport } from 'react-icons/md';  // Removed, no airports now
// import { FaTrain } from 'react-icons/fa';         // Removed, no train stations now

// Optional: If you're still using LocationFormatter, import it:
// import LocationFormatter from '../LocationFormatter/LocationFormatter';

interface LocationDDMGroupsProps {
  // Data shape: each key is a country, each value is an array of city strings
  options: { [country: string]: string[] };
  handleSelectLocation: (location: string) => void;
  search: string;
  setSearch: (value: string) => void;
}

export default function LocationDDMGroups({
  options,
  handleSelectLocation,
  search,
}: LocationDDMGroupsProps) {
  const inputTextSize = useBreakpointValue({
    md: 'xs',
    lg: 'sm',
    xl: 'md',
  });

  // Filter out city names that don't match the search
  const filteredOptions = Object.keys(options).reduce(
    (acc, country) => {
      const filteredCities = options[country].filter((city) =>
        city.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredCities.length) {
        acc[country] = filteredCities;
      }
      return acc;
    },
    {} as { [country: string]: string[] }
  );

  return (
    <>
      {Object.keys(filteredOptions).length > 0 ? (
        Object.keys(filteredOptions).map((country) => (
          <MenuGroup title={country} key={country}>
            {filteredOptions[country].map((city) => (
              <MenuItem
                key={city}
                onClick={() => {
                  // e.g. "Zagreb, Croatia"
                  // You could store a combined string:
                  // handleSelectLocation(`${city}, ${country}`);
                  handleSelectLocation(`${city}, ${country}`);
                }}
                fontSize="sm"
                gap={2}
              >
                {/* Icon on the left */}
                <Box p={2} borderRadius="3px" bg="brandmiddlegray">
                  <FaCity />
                </Box>

                {/* If you have a special formatter, use it:
                    <LocationFormatter input={city} />
                   Otherwise just show the city name */}
                {/* <LocationFormatter input={city} /> */}
                {city}
              </MenuItem>
            ))}
          </MenuGroup>
        ))
      ) : (
        <MenuItem fontSize="sm" color="brandgray">
          No matching locations found
        </MenuItem>
      )}
    </>
  );
}
