'use client';

import React from 'react';
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

const BookingForm = () => {
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
      <Heading size="md" mb={4} color="gray.700">
        Book this car
      </Heading>
      <Stack spacing={4}>
        {/* Pick-up location */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Pick-up location
          </Text>
          <Select placeholder="Select location">
            <option value="zagreb">Zagreb</option>
            <option value="split">Split</option>
          </Select>
        </Box>

        {/* Pick-up date and time */}
        <Flex gap={2}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Pick-up date
            </Text>
            <Input type="date" />
          </Box>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Pick-up time
            </Text>
            <Input type="time" />
          </Box>
        </Flex>

        {/* Drop-off date and time */}
        <Flex gap={2}>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Drop-off date
            </Text>
            <Input type="date" />
          </Box>
          <Box flex="1">
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Drop-off time
            </Text>
            <Input type="time" />
          </Box>
        </Flex>

        {/* Drop-off location */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Drop-off location
          </Text>
          <Select placeholder="Select location">
            <option value="zagreb">Zagreb</option>
            <option value="split">Split</option>
          </Select>
        </Box>
      </Stack>
      {/* Rent button */}
      <Button colorScheme="blue" size="lg" mt={4}>
        Rent for €50
      </Button>
    </Box>
  );
};

export default BookingForm;
