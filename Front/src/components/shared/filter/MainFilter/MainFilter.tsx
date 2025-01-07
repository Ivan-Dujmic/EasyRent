'use client';

import { useState } from 'react';
import { Button, Flex, Box, Text, useBreakpointValue } from '@chakra-ui/react';
import DateTimeDDM from '@/components/features/DropDownMenus/DateTimeDDM/DateTimeDDM';
import LocationDDM from '@/components/features/DropDownMenus/LocationDDM/LocationDDM';

const options: { [key: string]: string[] } = {
  'Cities (including airports)': [
    'Zagreb, Croatia',
    'Sesvete, Croatia',
    'Velika Gorica, Croatia',
    'Samobor, Croatia',
    'Split, Croatia',
    'Rijeka, Croatia',
  ],
  Airports: [
    'Franjo Tuđman, ZAG, Zagreb, Croatia',
    'Split Airport, SPU, Split, Croatia',
    'Dubrovnik Airport, DBV, Dubrovnik, Croatia',
  ],
  'Train stations': [
    'Zagreb Central Station, Zagreb, Croatia',
    'Split Train Station, Split, Croatia',
    'Osijek Train Station, Osijek, Croatia',
    'Rijeka Train Station, Rijeka, Croatia',
  ],
};

export default function MainFilter() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);

  const [formErrors, setFormErrors] = useState({
    pickupLocation: false,
    dropoffLocation: false,
    pickupDate: false,
    dropoffDate: false,
  });

  const validateForm = () => {
    const errors = {
      pickupLocation: !pickupLocation,
      dropoffLocation: !dropoffLocation,
      pickupDate: !pickupDate,
      dropoffDate: !dropoffDate,
    };
    setFormErrors(errors);

    return !Object.values(errors).some((hasError) => hasError);
  };

  const handleSearch = () => {
    if (validateForm()) {
      console.log('Search Payload:', {
        pickupLocation,
        dropoffLocation,
        pickupDate,
        dropoffDate,
      });
    }
  };

  const maxWidth = useBreakpointValue({
    base: '80vw',
    md: '60vw',
    xl: '1200px',
  });

  const buttonWidth = useBreakpointValue({
    base: '100%',
    md: '100%',
    xl: '150px',
  });

  const locationWidth = useBreakpointValue({
    base: '100%',
    md: 'calc(50% - 1rem)',
    xl: 'calc(15% - 1rem)',
  });

  const dateTimeWidth = useBreakpointValue({
    base: '100%',
    md: 'calc(50% - 1rem)',
    xl: 'calc(25% - 1rem)',
  });

  const gap = useBreakpointValue({
    base: 2,
    md: 2,
    xl: 4,
  });

  const justifyContent = useBreakpointValue({
    base: 'space-around',
    md: 'space-between',
    xl: 'center',
  });

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      flexWrap="wrap"
      bg="white"
      width="100%"
      maxWidth={maxWidth}
      borderRadius={14}
      borderWidth="0px"
      align="center"
      py={5}
      px={{ base: 5, xl: 0 }}
      gap={gap}
      justifyContent={justifyContent}
    >
      {/* Locations */}
      <Box width={locationWidth}>
        <LocationDDM
          options={options}
          description="Pick-up location"
          placeHolder="From?"
          onLocationChange={(location) => setPickupLocation(location)}
        />
        {formErrors.pickupLocation && (
          <Text color="red.500" fontSize="sm">
            Pick-up location is required.
          </Text>
        )}
      </Box>
      <Box width={locationWidth}>
        <LocationDDM
          options={options}
          description="Drop-off location"
          placeHolder="To?"
          onLocationChange={(location) => setDropoffLocation(location)}
        />
        {formErrors.dropoffLocation && (
          <Text color="red.500" fontSize="sm">
            Drop-off location is required.
          </Text>
        )}
      </Box>

      {/* Date and Time */}
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          description="Pick-up date/time"
          placeHolder="Start?"
          minDate={new Date()} // Današnji dan ili kasnije
          maxDate={
            dropoffDate
              ? new Date(dropoffDate.getTime() - 24 * 60 * 60 * 1000) // Dan prije drop-off datuma
              : undefined // Nema ograničenja ako drop-off nije postavljen
          }
          onDateTimeChange={(dateTime) => setPickupDate(dateTime)}
        />
        {formErrors.pickupDate && (
          <Text color="red.500" fontSize="sm">
            Pick-up date/time is required.
          </Text>
        )}
      </Box>
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          description="Drop-off date/time"
          placeHolder="End?"
          minDate={
            pickupDate
              ? new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000) // Sljedeći dan nakon pick-up
              : new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // Sutrašnji dan ako pick-up nije postavljen
          }
          onDateTimeChange={(dateTime) => setDropoffDate(dateTime)}
        />
        {formErrors.dropoffDate && (
          <Text color="red.500" fontSize="sm">
            Drop-off date/time is required.
          </Text>
        )}
      </Box>

      {/* Search Button */}
      <Box width={buttonWidth} mt={{ base: 2, md: 4 }}>
        <Button
          bg="brandblue"
          size="lg"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          width="100%"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
    </Flex>
  );
}
