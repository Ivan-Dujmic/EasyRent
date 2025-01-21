'use client';

import React, { useState } from 'react';
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

interface BookingFormProps {
  balance: number;
  locations: ExtraLocationInfo[];
  offer_id: string;
}

interface UnavailablePickupResponse {
  intervals: {
    dateTimeRented: string;
    dateTimeReturned: string;
  }[];
  workingHours: {
    dayOfTheWeek: number;
    startTime: string;
    endTime: string;
  }[];
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
  const [isPickupDateEnabled, setIsPickupDateEnabled] = useState(false);

  const { trigger } = useSWRMutation<UnavailablePickupResponse>(
    () =>
      pickupLocationId
        ? swrKeys.unavailable_pick_up(offer_id, pickupLocationId)
        : null,
    CustomGet
  );

  const handlePickupLocationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const locationId = e.target.value;
    setPickupLocationId(locationId);
    setPickupDate('');
    setPickupTime('');
    setIsPickupDateEnabled(false);

    if (locationId) {
      try {
        const data: UnavailablePickupResponse = await trigger();
        console.log('Unavailable pickup times:', data.intervals);
        console.log('Working hours:', data.workingHours);
        setIsPickupDateEnabled(true);
      } catch (error) {
        console.error('Error fetching pickup data:', error);
      }
    }
  };

  const isDropoffEnabled = pickupLocationId && pickupDate && pickupTime;

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
            onChange={handlePickupLocationChange}
            borderColor="brandblue"
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {`${location.streetName} ${location.streetNo}, ${location.cityName}`}
              </option>
            ))}
          </Select>
        </Box>
        <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Pick-up date
            </Text>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              borderColor="brandblue"
              isDisabled={!isPickupDateEnabled}
            />
          </Box>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Pick-up time
            </Text>
            <Input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              borderColor="brandblue"
              isDisabled={!isPickupDateEnabled}
            />
          </Box>
        </Flex>
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Drop-off location
          </Text>
          <Select
            placeholder="Select location"
            value={dropoffLocationId}
            onChange={(e) => setDropoffLocationId(e.target.value)}
            borderColor="brandblue"
            isDisabled={!isDropoffEnabled}
          >
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {`${location.streetName} ${location.streetNo}, ${location.cityName}`}
              </option>
            ))}
          </Select>
        </Box>
        <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Drop-off date
            </Text>
            <Input
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              borderColor="brandblue"
              isDisabled={!isDropoffEnabled}
            />
          </Box>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Drop-off time
            </Text>
            <Input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              borderColor="brandblue"
              isDisabled={!isDropoffEnabled}
            />
          </Box>
        </Flex>
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
          isDisabled={!isDropoffEnabled}
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
          isDisabled={!isDropoffEnabled}
          width={{ base: '100%', md: 'auto' }}
        >
          Pay with Card
        </Button>
      </Flex>
    </Box>
  );
};

export default BookingForm;
