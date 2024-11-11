import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Vehicle } from '@/typings/vehicles/vehicles';
import React, { useState } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { useBreakpointValue } from '@chakra-ui/react';

interface VehicleListProps {
  vehicles: Vehicle[];
  description: string;
  useDescription: Boolean;
}

export default function VehicleList({
  vehicles,
  description,
  useDescription,
}: VehicleListProps) {
  const [startIndex, setStartIndex] = useState(0);
  const sliceSize = useBreakpointValue({ base: 4, xl: 5 });

  const handleScroll = (direction: 'left' | 'right') => {
    const totalVehicles = vehicles.length;
    const maxIndex = totalVehicles - 5; // Maksimalni početni indeks za prikaz 5 vozila
    if (direction === 'right') {
      setStartIndex((prevIndex) =>
        prevIndex + 2 <= maxIndex ? prevIndex + 2 : maxIndex
      );
    } else {
      setStartIndex((prevIndex) => (prevIndex - 2 >= 0 ? prevIndex - 2 : 0));
    }
  };

  return (
    <Flex direction="column" align="center" width="75%">
      {useDescription && (
        <Heading size="md" color="brandblack" alignSelf="flex-start">
          {description}
        </Heading>
      )}
      <Flex justify="space-between" align="center" width="100%" mb={2}>
        <IconButton
          aria-label="Scroll left"
          icon={<FaChevronLeft />}
          onClick={() => handleScroll('left')}
          isRound
        />
        <Flex overflow="hidden" gap={3} maxWidth="100%" px={2} py={3}>
          {vehicles
            .slice(startIndex, startIndex + (sliceSize || 4))
            .map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
        </Flex>
        <IconButton
          aria-label="Scroll right"
          icon={<FaChevronRight />}
          onClick={() => handleScroll('right')}
          isRound
        />
      </Flex>
    </Flex>
  );
}
