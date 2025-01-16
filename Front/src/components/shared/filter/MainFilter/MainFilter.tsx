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
import { useFilterContext } from '@/context/FilterContext/FilterContext';

// Lokacije iz primjera
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
  const { setFilterData } = useFilterContext();

  // 1) Umjesto da odmah čitamo localStorage, inicijaliziramo state na prazno:
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDateTime] = useState<Date | null>(null);
  const [dropoffDate, setdropoffDate] = useState<Date | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  // U ovom efektu označavamo da je komponenta mountana
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2) U ovom efektu (koji se *samo na klijentu* izvršava) čitamo localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPickup = localStorage.getItem('pickupLocation');
      const savedDropoff = localStorage.getItem('dropoffLocation');
      const savedPickupDate = localStorage.getItem('pickupDateTime');
      const savedDropoffDate = localStorage.getItem('dropoffDate');

      if (savedPickup) setPickupLocation(savedPickup);
      if (savedDropoff) setDropoffLocation(savedDropoff);
      if (savedPickupDate) setPickupDateTime(new Date(savedPickupDate));
      if (savedDropoffDate) setdropoffDate(new Date(savedDropoffDate));
    }
  }, []);

  // URL i greške u formi
  const [url, setUrl] = useState('');
  const [formErrors, setFormErrors] = useState({
    pickupLocation: false,
    dropoffLocation: false,
    pickupDate: false,
    dropoffDate: false,
  });

  // 3) Kada god url dobije vrijednost, fetchaj podatke (useSWRMutation)
  const { trigger } = useSWRMutation(url, CustomGet, {
    onSuccess: (data: ICar[]) => {
      setCars(data);
      router.push('/listing');
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  });

  useEffect(() => {
    if (url) {
      trigger(); // pokreće dohvat
    }
  }, [url, trigger]);

  // 4) Kad god se neki state promijeni, spremi ga u localStorage (opet, samo u effectu)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pickupLocation', pickupLocation);
      localStorage.setItem('dropoffLocation', dropoffLocation);
      if (pickupDate) {
        localStorage.setItem('pickupDateTime', pickupDate.toISOString());
      }
      if (dropoffDate) {
        localStorage.setItem('dropoffDate', dropoffDate.toISOString());
      }
    }
  }, [pickupLocation, dropoffLocation, pickupDate, dropoffDate]);

  // Validacija forme
  const validateForm = () => {
    const errors = {
      pickupLocation: !pickupLocation,
      dropoffLocation: !dropoffLocation,
      pickupDate: !pickupDate,
      dropoffDate: !dropoffDate,
    };
    setFormErrors(errors);
    // Ako ijedno polje fali -> false (ne prolazi)
    return !Object.values(errors).some((hasError) => hasError);
  };

  // Klik na "Search"
  const handleSearch = () => {
    if (!validateForm()) return;

    // Helper funkcija za odvajanje datuma i vremena
    const extractDateAndTime = (date: Date | null) => {
      if (!date) return { date: '', time: '' };
      const dateObj = new Date(date);
      const dateString = `${String(dateObj.getDate()).padStart(2, '0')}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, '0')}-${dateObj.getFullYear()}`;

      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;

      return { date: dateString, time: timeString };
    };

    // Helper za formatiranje gradova (npr. "Zagreb, Croatia" -> "Zagreb-Croatia")
    const formatLocation = (location: string) => {
      const [city, country] = location.split(',').map((s) => s.trim());
      return `${city}-${country}`;
    };

    // Ekstrahiranje i formatiranje
    const pickup = extractDateAndTime(pickupDate);
    const dropoff = extractDateAndTime(dropoffDate);
    const formattedPickup = formatLocation(pickupLocation);
    const formattedDropoff = formatLocation(dropoffLocation);

    // Spremi u globalni kontekst (side filter i sl.)
    setFilterData({
      pick_up_location: formattedPickup,
      drop_off_location: formattedDropoff,
      pick_up_date: pickup.date,
      pick_up_time: pickup.time,
      drop_off_date: dropoff.date,
      drop_off_time: dropoff.time,
    });

    // Kreiramo URL za swr
    const queryParams = new URLSearchParams({
      pick_up_location: formattedPickup,
      drop_off_location: formattedDropoff,
      pick_up_date: pickup.date,
      pick_up_time: pickup.time,
      drop_off_date: dropoff.date,
      drop_off_time: dropoff.time,
    });
    const fullUrl = swrKeys.search(queryParams.toString());
    console.log(fullUrl);
    setUrl(fullUrl); // Pokrenut će se fetch (useSWRMutation) u gorešnjem useEffectu
  };

  // Chakra breakpoint logika
  const breakpoints = useBreakpointValue({
    base: {
      maxWidth: '80vw',
      buttonWidth: '100%',
      locationWidth: '100%',
      dateTimeWidth: '100%',
      gap: 2,
      justifyContent: 'space-around',
    },
    md: {
      maxWidth: '60vw',
      buttonWidth: '100%',
      locationWidth: 'calc(50% - 1rem)',
      dateTimeWidth: 'calc(50% - 1rem)',
      gap: 2,
      justifyContent: 'space-between',
    },
    xl: {
      maxWidth: '1200px',
      buttonWidth: '150px',
      locationWidth: 'calc(15% - 1rem)',
      dateTimeWidth: 'calc(25% - 1rem)',
      gap: 4,
      justifyContent: 'center',
    },
  });

  // Ako komponenta još nije mountana (tj. na serveru ili prije učitavanja stilova/JS-a), ne prikazujemo ništa
  if (!isMounted) {
    return null;
  }

  // Ako se breakpointi još nisu izračunali (ili Chakra nije spreman):
  if (!breakpoints) return null;

  const {
    maxWidth,
    buttonWidth,
    locationWidth,
    dateTimeWidth,
    gap,
    justifyContent,
  } = breakpoints;

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
      {/* Pick-up location */}
      <Box width={locationWidth}>
        <LocationDDM
          options={options}
          description="Pick-up location"
          placeHolder="From?"
          value={pickupLocation}
          onLocationChange={(location) => {
            setPickupLocation(location);
            setFormErrors((prev) => ({
              ...prev,
              pickupLocation: location === '',
            }));
          }}
        />
        {formErrors.pickupLocation && (
          <Text color="brandyellow" fontSize="sm">
            Pick-up is required.
          </Text>
        )}
      </Box>

      {/* Drop-off location */}
      <Box width={locationWidth}>
        <LocationDDM
          options={options}
          description="Drop-off location"
          placeHolder="To?"
          value={dropoffLocation}
          onLocationChange={(location) => {
            setDropoffLocation(location);
            setFormErrors((prev) => ({
              ...prev,
              dropoffLocation: location === '',
            }));
          }}
        />
        {formErrors.dropoffLocation && (
          <Text color="brandyellow" fontSize="sm">
            Drop-off is required.
          </Text>
        )}
      </Box>

      {/* Pick-up date/time */}
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          initialDate={pickupDate}
          description="Pick-up date/time"
          placeHolder="Start?"
          minDate={
            dropoffDate
              ? new Date(dropoffDate.getTime() - 24 * 60 * 60 * 1000)
              : undefined
          }
          onDateTimeChange={(dateTime) => {
            setPickupDateTime(dateTime);
            setFormErrors((prev) => ({ ...prev, pickupDate: !dateTime }));
          }}
        />
        {formErrors.pickupDate && (
          <Text color="brandyellow" fontSize="sm">
            Pick-up date and time are required.
          </Text>
        )}
      </Box>

      {/* Drop-off date/time */}
      <Box width={dateTimeWidth}>
        <DateTimeDDM
          initialDate={dropoffDate}
          description="Drop-off date/time"
          placeHolder="End?"
          minDate={
            pickupDate
              ? new Date(pickupDate.getTime() + 24 * 60 * 60 * 1000)
              : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          }
          onDateTimeChange={(dateTime) => {
            setdropoffDate(dateTime);
            setFormErrors((prev) => ({ ...prev, dropoffDate: !dateTime }));
          }}
        />
        {formErrors.dropoffDate && (
          <Text color="brandyellow" fontSize="sm">
            Drop-off date and time are required.
          </Text>
        )}
      </Box>

      {/* Gumb za pretragu */}
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
