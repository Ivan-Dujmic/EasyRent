'use client';

import React from 'react';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const BookingLoginPrompt: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      flex="1"
      minW="280px" // Minimum width to avoid deformation
      width={'auto'} // Responsive width
      mx="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      textAlign="center"
      bg="brandwhite"
    >
      {/* Heading */}
      <Heading size="lg" mb={4} color="brandblue">
        Log In Required
      </Heading>

      {/* Description */}
      <Stack spacing={4} mb={6}>
        <Text fontSize="md" color="brandblack">
          To rent a car, you need to log in to your account.
        </Text>
        <Text fontSize="sm" color="gray.600">
          Don’t have an account yet? Register now and start booking cars easily!
        </Text>
      </Stack>

      {/* Buttons */}
      <Flex
        direction={{ base: 'column', sm: 'row' }} // Stack vertically on small screens, side-by-side on larger
        gap={4}
        justify="center"
      >
        <Button
          bg="brandblue"
          color="white"
          size="lg"
          onClick={() => handleNavigate('/login')}
          flex="1"
          minW="120px" // Minimum button width for consistency
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        >
          Log In
        </Button>
        <Button
          bg="brandblue"
          color="white"
          size="lg"
          onClick={() => handleNavigate('/register/user')}
          flex="1"
          minW="120px" // Minimum button width for consistency
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        >
          Register
        </Button>
      </Flex>
    </Box>
  );
};

export default BookingLoginPrompt;
