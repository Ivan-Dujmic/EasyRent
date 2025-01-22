'use client';

import { Flex, FlexProps, Heading, IconButton } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { mockVehicles } from '@/mockData/mockVehicles';
import { NextRouter } from 'next/router';
import { ICar } from '@/typings/vehicles/vehicles.type';

interface VehicleListProps extends FlexProps {
  vehicles?: Array<ICar>;
  description?: string;
  numCards?: number;
  cardGap?: number;
}

export default function VehicleList({
  vehicles = [],
  description = '',
  numCards = 4,
  cardGap = 24,
  justify = "center",
  ...rest
}: VehicleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  let [numCards_d, setNumCard] = useState(numCards);

  useEffect(() => {
    const current = containerRef.current;
    const updateContainerWidth = () => {
      if (current) {
        const { width } = current.getBoundingClientRect();
        setContainerWidth(width);
      }
    };

    updateContainerWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    if (current) {
      resizeObserver.observe(current);
    }

    return () => {
      if (current) {
        resizeObserver.unobserve(current);
      }
    };
  });

  const cardWidth = 260;

  useEffect(() => {
    let neededLength = numCards_d * cardWidth + (numCards_d - 1) * cardGap + 120;
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
  const justify_ = justify= numCards <= vehicles.length ? justify : "center"

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
      <Flex 
        position="relative" 
        align="center" 
        width="100%" mb={4} 
        justify={justify_}
      >
        {/* Left Scroll Button */}
        <Flex width="60px" justify={'center'} align={'center'}>
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
          justify={justify_}
          align="center"
          gap={`${cardGap}px`}
          minWidth={cardWidth + cardGap}
          py={'2px'}
        >
          {visibleVehicles.map((vehicle, index) => (
            <VehicleCard vehicle={vehicle} key={index} />
          ))}
        </Flex>

        {/* Right Scroll Button */}
        <Flex width="60px" justify={'center'} align={'center'}>
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
