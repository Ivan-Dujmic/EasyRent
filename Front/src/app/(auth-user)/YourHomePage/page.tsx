'use client';

import EasyRentMoto from '@/components/core/EasyRentMoto/EasyRentMoto';
import MainFilter from '@/components/shared/filter/MainFilter/MainFilter';
import CompanyList from '@/components/shared/company/CompanyList/CompanyList';
import { Flex, Heading, useBreakpointValue } from '@chakra-ui/react';
import { mockVehicles } from '@/mockData/mockVehicles';
import VehicleList from '@/components/shared/cars/VechileList/VechileList';
import { companies } from '@/mockData/mockCompanies';
import AuthHeader from '@/components/shared/Header/AuthUserHeader/AuthHeader';

export default function HomePage() {
  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  const headingSize = useBreakpointValue({
    md: 'sm', // Default heading size for laptop/tablet
    lg: 'lg', // Larger heading for desktop
  });

  return (
    <Flex direction="column" grow={1}>
      {/* <AuthRedirect to="/login" condition="isLoggedOut" /> */}
      <AuthHeader />
      {/* Drugi dio stranice */}
      <Flex
        bg="brandlightgray"
        minHeight="300px"
        color="brandblue"
        direction={'column'}
        align={'center'}
        justify={'flex-start'}
        py={gapSize}
        gap={gapSize}
      >
        <EasyRentMoto />
        <MainFilter />
        <Flex gap={gapSize} align={'center'} px={5}>
          <Heading size={headingSize} color={'brandblue'}>
            Trusted by the Best:
          </Heading>
          <CompanyList companies={companies} />
        </Flex>
      </Flex>

      {/* Dio stranice sa Listom automobila */}
      <Flex
        justify={'center'}
        align={'center'}
        direction={'column'}
        py={8}
        gap={2}
      >
        <VehicleList
          vehicles={mockVehicles}
          description={'Most popular:'}
          useDescription={true}
        />
        <VehicleList
          vehicles={mockVehicles}
          description={'Best value:'}
          useDescription={true}
        />
      </Flex>
    </Flex>
  );
}
