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

  const flexDirection =
    useBreakpointValue<'row' | 'column'>({
      base: 'column', // On smaller screens, stack elements
      md: 'row', // On medium screens and above, show in rows
    }) || 'row';

  const fieldWidth = useBreakpointValue({
    base: '100%', // Each element takes full width on small screens
    md: 'calc(50% - 1rem)', // Two elements per row on medium screens
    xl: 'calc(20% - 1rem)', // Four elements in a row on large screens
  });

  const maxWidth = useBreakpointValue({
    base: '80vw', // On smaller screens
    md: '60vw', // On medium and larger screens
  });

  const gap = useBreakpointValue({
    base: 2, // Smaller gaps on small screens
    md: 4, // Larger gaps on medium and larger screens
  });

  return (
    <Flex
      direction={flexDirection}
      flexWrap="wrap"
      bg="white"
      width="100%"
      maxWidth={maxWidth}
      borderRadius={14}
      borderWidth="0px"
      align="flex-end"
      p={5}
      gap={gap}
      justifyContent="space-between"
    >
      {/* Locations */}
      <Box width={fieldWidth}>
        <LocationDDM
          options={options}
          description="Pick-up location"
          placeHolder="From?"
        />
      </Box>
      <Box width={fieldWidth}>
        <LocationDDM
          options={options}
          description="Drop-off location"
          placeHolder="To?"
        />
      </Box>

      {/* Date and Time */}
      <Box width={fieldWidth}>
        <DateTimeDDM
          description="Pick-up date/time"
          placeHolder="Start?"
          minDate={new Date()} // Always allow today's date or later
          maxDate={dropoffDate || undefined} // Limit to drop-off date if selected
          onDateChange={(date) => setPickupDate(date)} // Update pickup date
        />
      </Box>
      <Box width={fieldWidth}>
        <DateTimeDDM
          description="Drop-off date/time"
          placeHolder="End?"
          minDate={pickupDate || new Date()} // Limit to pickup date or later
          onDateChange={(date) => setDropoffDate(date)} // Update dropoff date
        />
      </Box>

      {/* Search Button */}
      <Box width={fieldWidth} flex={1} mt={1}>
        <Button
          bg="brandblue"
          size="lg"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          width="100%" // Button always takes full width in its container
        >
          Search
        </Button>
      </Box>
    </Flex>
  );
}
