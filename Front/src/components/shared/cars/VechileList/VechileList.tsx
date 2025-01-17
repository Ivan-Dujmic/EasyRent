'use client';

import {
  Flex,
  Heading,
  IconButton,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { ICar } from '@/fetchers/homeData';
import { mockVehicles } from '@/mockData/mockVehicles';

interface VehicleListProps {
  vehicles?: Array<ICar>;
  description?: string;
  numCards?: number;
  cardGap?: number;
}

export default function VehicleList({
  vehicles = mockVehicles,
  description = '',
  numCards = 4,
  cardGap = 24,
}: VehicleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  let [numCards_d, setNumCard] = useState(numCards);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setContainerWidth(width);
      }
    };

    updateContainerWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  });

  const cardWidth = 260;

  useEffect(() => {
    let neededLength = numCards_d * cardWidth + (numCards_d - 1) * cardGap + 90;
    if (numCards_d > 1 && neededLength > containerWidth)
      setNumCard(numCards_d - 1);
    else if (
      numCards_d < numCards &&
      neededLength + cardWidth + cardGap <= containerWidth
    )
      setNumCard(numCards_d + 1);
  }, [numCards_d, cardGap, containerWidth, numCards]);

  const [startIndex, setStartIndex] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'right' && startIndex < vehicles.length - numCards) {
      setStartIndex((prev) => prev + 1);
    } else if (direction === 'left' && startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleVehicles = vehicles.slice(startIndex, startIndex + numCards_d);

  return (
    <Flex
      direction="column"
      align="center"
      width="100%"
      gap={8}
      ref={containerRef}
    >
      {description && (
        <Heading fontSize="1.4rem" color="brandblack" alignSelf="flex-start">
          {description}
        </Heading>
      )}
      <Flex position="relative" align="center" width="100%" mb={4}>
        {/* Left Scroll Button */}
        <Flex width="40px" justify={'center'} align={'center'}>
          {startIndex > 0 && (
            <IconButton
              mx="none"
              // transform="translateX(-50%)"
              aria-label="Scroll left"
              icon={<FaChevronLeft />}
              onClick={() => handleScroll('left')}
              isRound
            />
          )}
        </Flex>

        {/* Vehicle Cards */}
        <Flex
          flex="1"
          overflow="hidden"
          justify="center"
          align="center"
          gap={`${cardGap}px`}
          py={'2px'}
        >
          {visibleVehicles.map((vehicle, index) => (
            <VehicleCard vehicle={vehicle} key={index} />
          ))}
        </Flex>

        {/* Right Scroll Button */}
        <Flex width="40px" justify={'center'} align={'center'}>
          {startIndex < vehicles.length - numCards && (
            <IconButton
              mx="none"
              // transform="translateX(50%)"
              aria-label="Scroll right"
              icon={<FaChevronRight />}
              onClick={() => handleScroll('right')}
              isRound
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
