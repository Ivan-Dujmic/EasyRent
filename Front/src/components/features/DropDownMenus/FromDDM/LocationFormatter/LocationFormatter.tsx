import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface LocationProps {
  input: string; // Ulazni string koji predstavlja lokaciju
  type: string; // Tip lokacije
}

// Komponenta koja formatira lokaciju prema vrsti
const LocationFormatter: React.FC<LocationProps> = ({ input, type }) => {
  // Razdvajanje stringa na dijelove
  const parts = input.split(',').map((part) => part.trim());

  if (type === 'Cities (including airports)') {
    return (
      <Box>
        <Text>{input}</Text> {/* Grad prikazan normalno */}
      </Box>
    );
  }

  if (type === 'Airports') {
    const [airportName, airportAbbreviation, airportCity, airportCountry] =
      parts;
    return (
      <Box>
        <Flex alignItems="center" justifyContent="space-between">
          <Text isTruncated>{airportName}</Text>
          <Text as="span" color="brandblue" ml={2}>
            {airportAbbreviation}
          </Text>
        </Flex>
        <Text fontSize="xs" color="brandgray">
          {airportCity}, {airportCountry}
        </Text>
      </Box>
    );
  }

  if (type === 'Train stations') {
    const [stationName, stationCity, stationCountry] = parts;
    return (
      <Box>
        <Text>{stationName}</Text>
        <Text fontSize="xs" color="brandgray">
          {stationCity}, {stationCountry}
        </Text>
      </Box>
    );
  }

  return null; // Ako tip nije prepoznat, ništa ne prikazuje
};

export default LocationFormatter;
