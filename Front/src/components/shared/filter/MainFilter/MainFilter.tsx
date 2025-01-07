'use client';

import { useState } from 'react';
import { Button, Flex, Box, useBreakpointValue } from '@chakra-ui/react';
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
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);

  const maxWidth = useBreakpointValue({
    base: '80vw', // On smaller screens
    md: '60vw', // On medium and larger screens
    xl: '1200px', // On very large screens
  });

  const buttonWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: '100%', // Medium-sized on medium screens
    xl: '150px', // Compact button on extra-large screens
  });

  const locationWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: 'calc(50% - 1rem)', // Medium-sized location input
    xl: 'calc(15% - 1rem)', // Compact location input on extra-large screens
  });

  const dateTimeWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: 'calc(50% - 1rem)', // Medium-sized date/time input
    xl: 'calc(25% - 1rem)', // Wider date/time input on extra-large screens
  });

  const gap = useBreakpointValue({
    base: 2,
    md: 2,
    xl: 4, // Increased spacing for very large screens
  });

  const justifyContent = useBreakpointValue({
    base: 'space-around', // Spaced around on small screens
    md: 'space-between', // Balanced spacing on medium screens
    xl: 'center', // Even spacing on extra-large screens
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
        />
      </Box>
      <Box width={locationWidth}>
        <LocationDDM
          options={options}
          description="Drop-off location"
          placeHolder="To?"
        />
      </Box>

      {/* Date and Time */}
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          description="Pick-up date/time"
          placeHolder="Start?"
          minDate={new Date()} // Allow today or later
          maxDate={dropoffDate || undefined} // Restrict to drop-off date if selected
          onDateTimeChange={(dateTime) => setPickupDate(dateTime)}
        />
      </Box>
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          description="Drop-off date/time"
          placeHolder="End?"
          minDate={
            pickupDate
              ? new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000) // Add 1 day to pickup date
              : new Date() // Allow today or later if no pickup date is selected
          }
          maxDate={undefined} // No upper limit
          onDateTimeChange={(dateTime) => setDropoffDate(dateTime)}
        />
      </Box>

      {/* Search Button */}
      <Box width={buttonWidth} mt={{ base: 2, md: 4 }}>
        <Button
          bg="brandblue"
          size="lg"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          width="100%"
        >
          Search
        </Button>
      </Box>
    </Flex>
  );
}
