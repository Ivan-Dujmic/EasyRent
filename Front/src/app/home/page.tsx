'use client';

import EasyRentMoto from '@/components/core/EasyRentMoto/EasyRentMoto';
import MainFilter from '@/components/shared/filter/MainFilter/MainFilter';
import Header from '@/components/shared/Header/Header';
import { Center, Flex, Heading, Text } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Flex direction="column" grow={1}>
      {/* <AuthRedirect to="/login" condition="isLoggedOut" /> */}
      <Header />
      <Flex
        bg="brandgray"
        minHeight="300px"
        color="brandblue"
        direction={'column'}
        align={'center'}
        justify={'flex-start'}
        py={14}
        gap={14}
      >
        <EasyRentMoto />
        <MainFilter />
      </Flex>
    </Flex>
  );
}
