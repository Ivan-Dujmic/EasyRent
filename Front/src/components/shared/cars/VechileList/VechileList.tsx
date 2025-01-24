'use client';

import { Flex, FlexProps, Heading, IconButton } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { ICar } from '@/typings/vehicles/vehicles.type';

interface VehicleListProps extends FlexProps {
  vehicles?: Array<ICar>;
  description?: string;
  numCards?: number;
  cardGap?: number;
  /**
   * If true, clicking a non-reviewable vehicle card (with rentalFrom/rentalTo)
   * will open a "Rental Details" modal instead of navigating to /offer/[offer_id].
   * Defaults to false.
   */
  showRentalDetailsOnClick?: boolean;
}

export default function VehicleList({
  vehicles = [],
  description = '',
  numCards = 4,
  cardGap = 24,
  justify = 'center',
  showRentalDetailsOnClick = false, // <-- new prop
  ...rest
}: VehicleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const [numCards_d, setNumCard] = useState(numCards);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const current = containerRef.current;
    const updateContainerWidth = () => {
      if (current) {
        const { width } = current.getBoundingClientRect();
        setContainerWidth(width);
      }
    };

    updateContainerWidth();

    // Observe container size changes
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
  }, []);

  const cardWidth = 260;

  useEffect(() => {
    const neededLength =
      numCards_d * cardWidth + (numCards_d - 1) * cardGap + 120 + 1;

    // Decrease numCards_d if container is too small
    if (numCards_d > 1 && neededLength > containerWidth) {
      setNumCard(numCards_d - 1);
    }
    // Increase numCards_d if there's still room
    else if (
      numCards_d < numCards &&
      neededLength + cardWidth + cardGap <= containerWidth
    ) {
      setNumCard(numCards_d + 1);
    }

    // Adjust startIndex if we've scrolled beyond the available items
    if (vehicles.length - numCards_d <= startIndex && startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  }, [cardGap, containerWidth, numCards, numCards_d, startIndex, vehicles]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'right' && startIndex < vehicles.length - numCards_d) {
      setStartIndex((prev) => prev + 1);
    } else if (direction === 'left' && startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleVehicles = vehicles.slice(startIndex, startIndex + numCards_d);
  const justify_ = numCards > vehicles.length ? justify : 'center';

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
        width="100%"
        mb={4}
        justify={justify_}
      >
        {/* Left Scroll Button */}
        <Flex width="60px" justify="center" align="center">
          {startIndex > 0 && (
            <IconButton
              mx="none"
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
          py="2px"
          {...rest}
        >
          {visibleVehicles.map((vehicle, index) => (
            <VehicleCard
              key={index}
              vehicle={vehicle}
              // Pass the new prop to each card
              showRentalDetailsOnClick={showRentalDetailsOnClick}
            />
          ))}
        </Flex>

        {/* Right Scroll Button */}
        <Flex width="60px" justify="center" align="center">
          {startIndex < vehicles.length - numCards_d && (
            <IconButton
              mx="none"
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
