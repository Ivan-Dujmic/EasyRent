'use client';

import VehicleOfferCard from '@/components/shared/cars/VehicleOfferCard/VehicleOfferCard';
import AuthUserHeader from '@/components/shared/Header/AuthUserHeader/AuthUserHeader';
import Header from '@/components/shared/Header/Header';
import BookingForm from '@/components/shared/offer/BookingForm/BookingForm';
import { useUserContext } from '@/context/UserContext/UserContext';
import { mockOffer } from '@/mockData/mockOffer';
import { Box, Flex, Heading, useBreakpointValue } from '@chakra-ui/react';

export default function OfferPage() {
  const { user } = useUserContext();

  const containerWidth = useBreakpointValue({
    base: '90%', // Width for mobile devices
    sm: '85%', // Width for tablets
    md: '80%', // Width for medium-sized screens
    lg: '70%', // Width for larger screens
    xl: '60%', // Width for extra-large screens
  });

  return (
    <Flex
      direction="column"
      grow={1}
      align={'center'}
      width={'100%'}
      gap={5}
      justifyContent={'flex-start'}
    >
      {/* Conditional Header Based on User Role */}
      {user.role === 'user' && <AuthUserHeader UserData={user} />}
      {user.role !== 'user' && <Header />}

      {/* Offer Section */}
      <Flex
        justify={'center'}
        align={'center'}
        direction={'column'}
        width={containerWidth}
        mt={6}
        px={4} // Padding for spacing on smaller screens
        gap={5}
      >
        <Heading size={'lg'} color="brandblack" alignSelf="flex-start">
          Your Offer:
        </Heading>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 6, md: 8 }} // Adjust spacing for mobile vs. desktop
          align="center"
          justify="center"
          width="100%"
        >
          {/* Offer Card */}
          <VehicleOfferCard vehicle={mockOffer} />
        </Flex>
      </Flex>
    </Flex>
  );
}
