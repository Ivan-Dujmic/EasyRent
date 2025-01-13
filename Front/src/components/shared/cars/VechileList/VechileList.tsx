'use client';

import {
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { ICar } from '@/fetchers/homeData';
import { mockVehicles } from '@/mockData/mockVehicles';

interface VehicleListProps {
  vehicles?: Array<ICar>;
  description?: string;
}

export default function VehicleList({
  vehicles = mockVehicles,
  description = undefined,
}: VehicleListProps) {
  // Dynamically determine the number of visible cards based on screen size
  const numCards =
    useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }) || 4;

  const gap = 24; // Increased the gap for better spacing
  const cardWidth = `calc((100% - ${(numCards - 1) * gap}px) / ${numCards})`;

  const [startIndex, setStartIndex] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'right' && startIndex < vehicles.length - numCards) {
      setStartIndex((prev) => prev + 1);
    } else if (direction === 'left' && startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleVehicles = vehicles.slice(startIndex, startIndex + numCards);

  return (
    <Flex direction="column" align="center" width="100%" gap={5}>
      {description && (
        <Heading fontSize="1.4rem" color="brandblack" alignSelf="flex-start">
          {description}
        </Heading>
      )}
      <Flex
        position="relative"
        justify="center"
        align="center"
        width="100%"
        mb={4}
      >
        {/* Left Scroll Button */}
        {startIndex > 0 && (
          <IconButton
            position="absolute"
            left="-2rem" // Moves the arrow further left (negative value to move outside)
            transform="translateX(-50%)"
            aria-label="Scroll left"
            icon={<FaChevronLeft />}
            onClick={() => handleScroll('left')}
            isRound
            zIndex="1"
          />
        )}

        {/* Vehicle Cards */}
        <Flex
          overflow="hidden"
          justify="center"
          align="center"
          width="90%"
          gap={`${gap}px`}
          px={2}
          flexGrow={1}
          height={'fit-content'}
          py={2}
        >
          {visibleVehicles.map((vehicle, index) => (
            <div
              key={index}
              style={{
                flex: '0 0 auto',
                width: cardWidth,
                maxWidth: cardWidth,
              }}
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </Flex>

        {/* Right Scroll Button */}
        {startIndex < vehicles.length - numCards && (
          <IconButton
            position="absolute"
            right="-2rem" // Moves the arrow further right
            transform="translateX(50%)"
            aria-label="Scroll right"
            icon={<FaChevronRight />}
            onClick={() => handleScroll('right')}
            isRound
            zIndex="1"
          />
        )}
      </Flex>
    </Flex>
  );
}
