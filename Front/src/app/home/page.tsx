'use client';

import Header from '@/components/shared/Header/Header';
import { Center, Flex, Heading } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Flex direction="column" grow={1}>
      {/* <AuthRedirect to="/login" condition="isLoggedOut" /> */}
      <Header />
      <Flex
        bg="brandgray"
        h="250px"
        color="brandblue"
        direction={'column'}
        align={'center'}
        justify={'flex-start'}
        pt={20}
      >
        <Heading>Your Key to Effortless Car Rentals</Heading>
      </Flex>
    </Flex>
  );
}
