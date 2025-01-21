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

interface BookingFormProps {
  balance: number;
  locations: ExtraLocationInfo[];
  offer_id: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  balance,
  locations,
  offer_id,
}) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');

  const isPickupDateEnabled = !!pickupLocation;
  const isDropoffEnabled = pickupLocation && pickupDate && pickupTime;

  const handleRent = (paymentMethod: string) => {
    console.log({
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffLocation,
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
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            borderColor="brandblue"
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
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
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
