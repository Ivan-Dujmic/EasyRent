'use client';

import { useState } from 'react';
import { Flex, IconButton, Text, useBreakpointValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { ICar } from '@/fetchers/homeData';
import VehicleCard from '../VehicleCard/VechileCard';

interface IVehicleGridProps {
  vehicles: ICar[];
}

export const VehicleGrid = ({ vehicles }: IVehicleGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerRow = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 4 });
  const rowsPerPage = 4; // Fixed number of rows per page
  const itemsPerPage = (itemsPerRow || 1) * rowsPerPage;

  const totalPages = Math.ceil(vehicles.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = vehicles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Flex direction="column" align="center" width="100%">
      <Flex
        direction="row"
        wrap="wrap"
        justify={'center'}
        gap={6}
        width="100%"
        mb={4}
      >
        {currentVehicles.map((vehicle) => (
          <VehicleCard vehicle={vehicle} key={vehicle.offer_id} />
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
