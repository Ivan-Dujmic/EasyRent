'use client';

import { useState } from 'react';
import { Flex, IconButton, Text, useBreakpointValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import VehicleCard from '../VehicleCard/VechileCard';
import { ICar } from '@/typings/vehicles/vehicles.type';

interface IVehicleGridProps {
  vehicles: ICar[] | null;
}

export const VehicleGrid = ({ vehicles }: IVehicleGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerRow = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 4 });
  const rowsPerPage = 3; // Fixed number of rows per page
  const itemsPerPage = (itemsPerRow || 1) * rowsPerPage;

  // Funkcija za nasumično miješanje niza (Fisher-Yates shuffle algoritam)
  const shuffleArray = (array: ICar[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Provjera da li je vehicles validan niz, ako nije postavi prazan niz
  const validVehicles = Array.isArray(vehicles) ? shuffleArray(vehicles) : [];

  // Provjeri da li ima vozila za prikaz
  if (validVehicles.length === 0) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        width="100%"
        height="300px"
        bg="brandlightgray" // Light background for contrast
        borderRadius="md"
        boxShadow="md"
        p={6}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="brandblue"
          textAlign="center"
        >
          Oops! No offers found.
        </Text>
        <Text
          fontSize="md"
          color="gray.600"
          textAlign="center"
          mt={2}
          maxWidth="80%"
        >
          Sorry, we couldn&apos;t find any offers matching your request. Please
          try adjusting your search criteria.
        </Text>
        <Flex mt={4}>
          <a href="/home">
            <Flex
              as="button"
              bg="brandblue"
              color="white"
              px={6}
              py={3}
              borderRadius="md"
              fontWeight="bold"
              fontSize="md"
              _hover={{
                bg: 'brandyellow',
                transition: 'background-color 0.3s ease',
                color: 'brandblack',
              }}
              _active={{
                bg: 'blue.700',
              }}
            >
              Go to Home Page
            </Flex>
          </a>
        </Flex>
      </Flex>
    );
  }

  const totalPages = Math.ceil(validVehicles.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = validVehicles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Flex direction="column" align="center" width="100%">
      <Flex
        direction="row"
        wrap="wrap"
        justify="center"
        gap={6}
        width="100%"
        mb={4}
      >
        {currentVehicles.map((vehicle) => (
          <VehicleCard vehicle={vehicle} key={Number(vehicle.offer_id)} />
        ))}
      </Flex>

      {totalPages > 1 && (
        <Flex justifyContent="center" align="center" width="100%" mt={4}>
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={handlePrevPage}
            isDisabled={currentPage === 1}
            aria-label="Previous page"
          />
          <Text mx={4}>
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            aria-label="Next page"
          />
        </Flex>
      )}
    </Flex>
  );
};
