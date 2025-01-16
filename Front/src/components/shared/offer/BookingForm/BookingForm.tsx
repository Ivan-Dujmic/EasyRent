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
} from '@chakra-ui/react';
import { FaCreditCard, FaWallet } from 'react-icons/fa';

interface BookingFormProps {
  balance: number; // The balance to be displayed on the button
}

const options = ['Zagreb, Croatia', 'Split, Croatia', 'Rijeka, Croatia'];

const BookingForm: React.FC<BookingFormProps> = ({ balance }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');

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

  return (
    <Box
      flex="1"
      minWidth="300px"
      p={5}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      boxShadow="sm"
    >
      <Heading size="md" mb={4} color="brandblue">
        Book this car
      </Heading>
      <Stack spacing={4}>
        {/* Pick-up location */}
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
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Box>

        {/* Pick-up date and time */}
        <Flex gap={2}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Pick-up date
            </Text>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              borderColor="brandblue"
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
            />
          </Box>
        </Flex>

        {/* Drop-off location */}
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
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Box>

        {/* Drop-off date and time */}
        <Flex gap={2}>
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

      {/* Payment buttons */}
      <Flex justifyContent="flex-end" alignItems="center" mt={6} gap={4}>
        <Button
          rightIcon={<FaWallet />}
          bg="brandblue"
          color="white"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          size="lg"
          onClick={() => handleRent('wallet')}
          isDisabled={!isDropoffEnabled}
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
        >
          Pay with Card
        </Button>
      </Flex>
    </Box>
  );
};

export default BookingForm;
