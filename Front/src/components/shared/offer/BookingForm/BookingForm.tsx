'use client';

import React, { Suspense, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaCreditCard, FaWallet } from 'react-icons/fa';
import { ExtraLocationInfo } from '@/typings/locations/locations';
import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { CustomGet } from '@/fetchers/get';
import 'react-datepicker/dist/react-datepicker.css';
import CustomCalendar from '@/components/features/DropDownMenus/CustomCalendar/CustomCalendar';

const disabledDates = [new Date('2025-01-10'), new Date('2025-01-15')];

const rentalIntervals = [
  {
    dateTimeRented: '2025-02-02T15:27:13.009Z',
    dateTimeReturned: '2025-02-10T15:27:13.009Z',
  },
];

const workingHours = [
  { dayOfTheWeek: 0, startTime: '09:00', endTime: '17:00' },
  { dayOfTheWeek: 1, startTime: '09:00', endTime: '17:00' },
];

const minDate = new Date();
const maxDate = new Date('2025-12-31');

interface BookingFormProps {
  balance: number;
  locations: ExtraLocationInfo[];
  offer_id: string;
}

export interface Interval {
  dateTimeRented: string; // npr. "2025-01-21T16:52:11.243Z"
  dateTimeReturned: string; // npr. "2025-01-22T10:15:00.000Z"
}

export interface WorkingHour {
  /** 0 = Ponedjeljak, 1 = Utorak, …, 6 = Nedjelja */
  dayOfTheWeek: number;
  startTime: string; // npr. "09:00:00"
  endTime: string; // npr. "17:00:00"
}

export interface UnavailablePickupResponse {
  intervals: Interval[];
  workingHours: WorkingHour[];
}

export interface AvailableDropOffResponse {
  lastReturnDateTime: string | null; // Može biti null ili string u ISO 8601 formatu
  vehicle_id: number;
  workingHours: WorkingHour[];
}

const BookingForm: React.FC<BookingFormProps> = ({
  balance,
  locations,
  offer_id,
}) => {
  const [pickupLocationId, setPickupLocationId] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffLocationId, setDropoffLocationId] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [vehicle_id, setVehicle_id] = useState('');
  const [isPickupDateEnabled, setIsPickupDateEnabled] = useState(false);
  const [isDropOffDateTimeEnabled, setIsDropOffDateTimeEnabled] =
    useState(false);
  const [pickUpDateTimeAvaiable, setPickUpDateTimeAvaiable] = useState<
    UnavailablePickupResponse | undefined
  >(undefined);
  const [dropOffDateTimeAvaiable, setDropOffDateTimeAvaiable] = useState<
    AvailableDropOffResponse | undefined
  >(undefined);

  // testrianje za dateTime
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const intervals = [
    {
      dateTimeRented: '2025-01-21T16:52:11.243Z',
      dateTimeReturned: '2025-01-24T10:15:00.000Z',
    },
    {
      dateTimeRented: '2025-01-26T16:52:11.243Z',
      dateTimeReturned: '2025-01-28T10:15:00.000Z',
    },
    {
      dateTimeRented: '2025-02-05T16:52:11.243Z',
      dateTimeReturned: '2025-02-10T10:15:00.000Z',
    },
  ];

  const workingHours = [
    { dayOfTheWeek: 0, startTime: '09:00:00', endTime: '17:00:00' },
    { dayOfTheWeek: 1, startTime: '09:00:00', endTime: '17:00:00' },
    { dayOfTheWeek: 2, startTime: '09:00:00', endTime: '17:00:00' },
    { dayOfTheWeek: 3, startTime: '09:00:00', endTime: '17:00:00' },
    { dayOfTheWeek: 4, startTime: '09:00:00', endTime: '17:00:00' },
    { dayOfTheWeek: 6, startTime: '10:00:00', endTime: '14:00:00' },
  ];

  const handlePickUpDateTimeSelect = (dateTime: Date | null) => {
    if (dateTime) {
      const formattedDate = dateTime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const formattedTime = dateTime.getHours(); // Extract hour (0-23)

      setPickupDate(formattedDate);
      setPickupTime(formattedTime.toString()); // Convert hour to string for consistency

      console.log('Odabrano vrijeme:', formattedDate, formattedTime);
    }
    if (dateTime === null) {
      setPickupDate('');
      setPickupTime('');
      setDropoffLocationId('');
      setDropoffDate('');
      setDropoffTime('');
      setIsDropOffDateTimeEnabled(false);
      console.log('vrijeme bi trebalo biti resetirano');
    }
  };

  const handleDropoffDateTimeSelect = (dateTime: Date | null) => {
    if (dateTime) {
      const formattedDate = dateTime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const formattedTime = dateTime.getHours(); // Extract hour (0-23)

      setDropoffDate(formattedDate);
      setDropoffTime(formattedTime.toString()); // Convert hour to string for consistency

      console.log('Odabrano Drop-off vrijeme:', formattedDate, formattedTime);
    }
    if (dateTime === null) {
      setDropoffDate('');
      setDropoffTime('');
      console.log('vrijeme bi trebalo biti resetirano');
    }
  };

  const { trigger } = useSWRMutation<UnavailablePickupResponse>(
    swrKeys.unavailable_pick_up(offer_id, pickupLocationId),
    CustomGet,
    {
      onSuccess: (data) => {
        console.log('Unavailable pickup times:', data.intervals);
        console.log('Working hours:', data.workingHours);
        setPickUpDateTimeAvaiable(data);
        setIsPickupDateEnabled(true);
      },
      onError: (error) => {
        console.error('Error fetching pickup data:', error);
      },
    }
  );

  const { trigger: triggerDropOf } = useSWRMutation<AvailableDropOffResponse>(
    swrKeys.available_drop_off(
      offer_id,
      pickupLocationId,
      pickupDate,
      pickupTime,
      dropoffLocationId
    ),
    CustomGet,
    {
      onSuccess: (data) => {
        console.log('lastReturnDateTime:', data.lastReturnDateTime);
        console.log('vehicle_id:', data.vehicle_id);
        console.log('Working hours:', data.workingHours);
        setDropOffDateTimeAvaiable(data);
        setIsDropOffDateTimeEnabled(true);
        setVehicle_id(data.vehicle_id.toString());
      },
      onError: (error) => {
        console.error('Error fetching pickup data:', error);
      },
    }
  );

  const handlePickupLocationChange = (locationId: string) => {
    console.log('e je: ', locationId);

    setPickupLocationId(locationId); // Set state first

    // Reset fields to ensure a clean state
    setPickupDate('');
    setPickupTime('');
    setDropoffLocationId('');
    setDropoffDate('');
    setDropoffTime('');
    setIsDropOffDateTimeEnabled(false);
    setIsPickupDateEnabled(false);
  };

  const handleDropOffLocationChange = (locationId: string) => {
    console.log('e za drop off je: ', locationId);

    setDropoffLocationId(locationId); // Set state first

    // Reset fields to ensure a clean state
    setDropoffDate('');
    setDropoffTime('');
    setIsDropOffDateTimeEnabled(false);
  };

  // React to state update
  React.useEffect(() => {
    if (pickupLocationId) {
      trigger();
    }
  }, [pickupLocationId, trigger]);

  // React to state update
  React.useEffect(() => {
    if (dropoffLocationId) {
      triggerDropOf();
    }
  }, [dropoffLocationId, triggerDropOf]);

  const isDropoffLocationEnabled = pickupLocationId && pickupDate && pickupTime;
  const isTransactionEnabled =
    isDropoffLocationEnabled && dropoffLocationId && dropoffDate && dropoffTime;

  const handleRent = (paymentMethod: string) => {
    console.log({
      pickupLocationId,
      pickupDate,
      pickupTime,
      dropoffLocationId,
      dropoffDate,
      dropoffTime,
      paymentMethod,
    });
  };

  const formWidth = useBreakpointValue({
    base: '100%',
    md: '80%',
    lg: '60%',
  });

  return (
    <Box
      width={formWidth}
      mx="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="brandwhite"
    >
      <Heading size="md" mb={6} color="brandblue" textAlign="center">
        Book this car
      </Heading>
      <Stack spacing={4}>
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Pick-up location
          </Text>
          <Select
            placeholder="Select location"
            value={pickupLocationId}
            onChange={(e) => handlePickupLocationChange(e.target.value)}
            borderColor="brandblue"
            borderWidth="2px"
            borderRadius="md"
          >
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {`${location.streetName} ${location.streetNo}, ${location.cityName} ${location.location_id}`}
              </option>
            ))}
          </Select>
        </Box>
        <CustomCalendar
          pickupLabel="Pick-up date"
          pickupTimeLabel="Pick-up time"
          placeholderDate="dd.mm.gggg."
          placeholderTime="--:--"
          intervals={pickUpDateTimeAvaiable?.intervals}
          workingHours={pickUpDateTimeAvaiable?.workingHours}
          onDateTimeChange={handlePickUpDateTimeSelect}
          initialDateTime={null}
          minDate={new Date()} // Ne dopusti prošlost
          isDisabled={!isPickupDateEnabled}
          pickupLocationId={pickupLocationId}
        />
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Drop-off location
          </Text>
          <Select
            placeholder="Select location"
            value={dropoffLocationId}
            onChange={(e) => handleDropOffLocationChange(e.target.value)}
            borderColor="brandblue"
            borderWidth="2px"
            borderRadius="md"
            isDisabled={!isDropoffLocationEnabled}
          >
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {`${location.streetName} ${location.streetNo}, ${location.cityName}`}
              </option>
            ))}
          </Select>
        </Box>
        <CustomCalendar
          pickupLabel="Drop-off date"
          pickupTimeLabel="Drop-off time"
          placeholderDate="dd.mm.gggg."
          placeholderTime="--:--"
          workingHours={dropOffDateTimeAvaiable?.workingHours}
          onDateTimeChange={handleDropoffDateTimeSelect}
          initialDateTime={null}
          minDate={new Date()} // Ne dopusti prošlost
          maxDate={
            dropOffDateTimeAvaiable?.lastReturnDateTime
              ? new Date(
                  new Date(dropOffDateTimeAvaiable.lastReturnDateTime).setDate(
                    new Date(
                      dropOffDateTimeAvaiable.lastReturnDateTime
                    ).getDate() - 1
                  )
                )
              : undefined
          }
          isDisabled={!isDropOffDateTimeEnabled}
          pickupLocationId={pickupLocationId} // vidit jel treba dodat drop of lcoation id
          dropoffLocationId={dropoffLocationId}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
        />
      </Stack>
      <Flex
        justifyContent="center"
        alignItems="center"
        mt={6}
        gap={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Button
          rightIcon={<FaWallet />}
          bg="brandblue"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          size="lg"
          onClick={() => handleRent('wallet')}
          isDisabled={!isTransactionEnabled} // promjenit to kasnije
          width={{ base: '100%', md: 'auto' }}
        >
          Pay with Wallet
        </Button>
        <Button
          rightIcon={<FaCreditCard />}
          bg="brandblue"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          size="lg"
          onClick={() => handleRent('card')}
          isDisabled={!isTransactionEnabled} // promjenit to kasnije
          width={{ base: '100%', md: 'auto' }}
        >
          Pay with Card
        </Button>
      </Flex>
    </Box>
  );
};

export default BookingForm;
