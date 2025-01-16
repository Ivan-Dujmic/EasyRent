'use client';

import { useEffect, useState } from 'react';
import { Button, Flex, Box, Text, useBreakpointValue } from '@chakra-ui/react';
import DateTimeDDM from '@/components/features/DropDownMenus/DateTimeDDM/DateTimeDDM';
import LocationDDM from '@/components/features/DropDownMenus/LocationDDM/LocationDDM';
import { useCarContext } from '@/context/CarContext';
import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import { CustomGet, ICar } from '@/fetchers/homeData';
import { swrKeys } from '@/fetchers/swrKeys';

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
  const router = useRouter();
  const { setCars } = useCarContext();

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [dropoffDate, setDropoffDate] = useState<Date | null>(null);
  const [url, setUrl] = useState(''); // State za URL

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

  const { trigger } = useSWRMutation(
    url,
    CustomGet,
    // Fetcher funkcija
    {
      onSuccess: (data: ICar[]) => {
        setCars(data); // Spremanje automobila u globalni kontekst
        router.push('/GuestListing'); // Preusmjeravanje na novu stranicu
      },
      onError: (error) => {
        console.error('Error fetching data:', error);
      },
    }
  );

  useEffect(() => {
    if (url) {
      trigger();
    }
  }, [url, trigger]);

  const handleSearch = () => {
    if (!validateForm()) return;

    /*     if (url) {
      // Ako URL već postoji, pokreće mutaciju
      trigger();
    }
 */

    // Helper funkcija za odvajanje datuma i vremena
    const extractDateAndTime = (date: Date | null) => {
      if (!date) return { date: '', time: '' };

      // Formatiranje datuma u DD-MM-YYYY
      const dateObj = new Date(date);
      const dateString = `${String(dateObj.getDate()).padStart(2, '0')}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, '0')}-${dateObj.getFullYear()}`;

      // Formatiranje vremena u HH:MM:SS
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;

      return { date: dateString, time: timeString };
    };

    // Helper funkcija za formatiranje gradova
    const formatLocation = (location: string) => {
      const [city, country] = location.split(',').map((s) => s.trim());
      return `${city}-${country}`;
    };

    // Ekstrahiranje i formatiranje podataka
    const pickup = extractDateAndTime(pickupDate);
    const dropoff = extractDateAndTime(dropoffDate);
    const formattedPickupLocation = formatLocation(pickupLocation);
    const formattedDropoffLocation = formatLocation(dropoffLocation);

    // Kreiranje URL-a sa query parametrima
    const queryParams = new URLSearchParams({
      pick_up_location: formattedPickupLocation,
      drop_off_location: formattedDropoffLocation,
      pick_up_date: pickup.date, // Datum u DD-MM-YYYY formatu
      pick_up_time: pickup.time, // Vrijeme u HH:MM:SS formatu
      drop_off_date: dropoff.date, // Datum u DD-MM-YYYY formatu
      drop_off_time: dropoff.time, // Vrijeme u HH:MM:SS formatu
    });

    const fullUrl = `/api/home/search?${queryParams.toString()}`;
    setUrl(fullUrl); // Postavljamo URL u state
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
          onLocationChange={(location) => {
            setPickupLocation(location);
            setFormErrors((prev) => ({
              ...prev,
              pickupLocation: location == '',
            }));
          }}
        />
        {formErrors.pickupLocation && (
          <Text color="brandyellow" fontSize="sm">
            Pick-up is required.
          </Text>
        )}
      </Box>
      <Box width={locationWidth}>
        <LocationDDM
          options={options}
          description="Drop-off location"
          placeHolder="To?"
          onLocationChange={(location) => {
            setDropoffLocation(location);
            setFormErrors((prev) => ({
              ...prev,
              dropoffLocation: location == '',
            }));
          }}
        />
        {formErrors.dropoffLocation && (
          <Text color="brandyellow" fontSize="sm">
            Drop-off is required.
          </Text>
        )}
      </Box>

      {/* Date and Time */}
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          description="Pick-up date/time"
          placeHolder="Start?"
          minDate={new Date()}
          maxDate={
            dropoffDate
              ? new Date(dropoffDate.getTime() - 24 * 60 * 60 * 1000)
              : undefined
          }
          onDateTimeChange={(dateTime) => {
            setPickupDate(dateTime);
            setFormErrors((prev) => ({ ...prev, pickupDate: !dateTime }));
          }}
        />
        {formErrors.pickupDate && (
          <Text color="brandyellow" fontSize="sm">
            Pick-up date and time are required.
          </Text>
        )}
      </Box>
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          description="Drop-off date/time"
          placeHolder="End?"
          minDate={
            pickupDate
              ? new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000)
              : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          }
          onDateTimeChange={(dateTime) => {
            setDropoffDate(dateTime);
            setFormErrors((prev) => ({ ...prev, dropoffDate: !dateTime }));
          }}
        />
        {formErrors.dropoffDate && (
          <Text color="brandyellow" fontSize="sm">
            Drop-off date and time are required.
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
