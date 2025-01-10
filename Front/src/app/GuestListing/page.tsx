'use client';

import EasyRentMoto from '@/components/core/EasyRentMoto/EasyRentMoto';
import MainFilter from '@/components/shared/filter/MainFilter/MainFilter';
import SideFilter from '@/components/shared/filter/SideFilter/SideFilter';
import Header from '@/components/shared/Header/Header';
import { useCarContext } from '@/context/CarContext';
import { Box, Text, Image, Flex, useBreakpointValue } from '@chakra-ui/react';

export default function ResultsPage() {
  const { cars } = useCarContext();

  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  /*   if (!cars) {
    return <Text>No results found.</Text>;
  } */

  return (
    <Flex direction="column" grow={1} align={'center'} width={'100%'}>
      <Header />
      {/* Drugi dio stranice */}
      <Flex
        bg="brandlightgray"
        minHeight="300px"
        color="brandblue"
        direction={'column'}
        align={'center'}
        justify={'center'}
        py={gapSize}
        gap={gapSize}
        width={'100%'}
      >
        <EasyRentMoto />
        <MainFilter />
      </Flex>

      <Flex direction={'row'}>
        <SideFilter />
      </Flex>
    </Flex>
  );
}
