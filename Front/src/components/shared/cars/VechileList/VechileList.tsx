'use client';

import { Flex, FlexProps, Heading, IconButton } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState, useRef, useEffect } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { ICar } from '@/typings/vehicles/vehicles.type';

interface VehicleListProps extends FlexProps {
  vehicles?: ICar[];
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
  showRentalDetailsOnClick = false,
  ...rest
}: VehicleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [numCards_d, setNumCards_d] = useState(numCards);

  // The starting index in the "vehicles" array of the leftmost visible card
  const [startIndex, setStartIndex] = useState(0);

  // Constant for each card's width (in px)
  const cardWidth = 260;

  /**
   * Updates containerWidth when the component mounts or the container is resized.
   */
  useEffect(() => {
    const current = containerRef.current;
    if (!current) return;

    const updateContainerWidth = () => {
      const { width } = current.getBoundingClientRect();
      setContainerWidth(width);
    };

    updateContainerWidth();
    const resizeObserver = new ResizeObserver(updateContainerWidth);
    resizeObserver.observe(current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * This effect recalculates how many cards can fit ("numCards_d")
   * based on the container width.
   */
  useEffect(() => {
    // The total width needed to display numCards_d cards + gaps + a small buffer.
    const neededLength =
      numCards_d * cardWidth + (numCards_d - 1) * cardGap + 120;

    // Decrease numCards_d if container is too small
    if (numCards_d > 1 && neededLength > containerWidth) {
      setNumCards_d(numCards_d - 1);
    }
    // Increase numCards_d if there's still room
    else if (
      numCards_d < numCards &&
      neededLength + cardWidth + cardGap <= containerWidth
    ) {
      setNumCards_d(numCards_d + 1);
    }

    // Clamp the startIndex if we have fewer items than before
    // We'll do that after we calculate maxIndex below.
  }, [cardGap, containerWidth, numCards, numCards_d]);

  /**
   * Calculate maxIndex: the rightmost valid start index.
   * If we have fewer items than we can display at once, maxIndex = 0.
   */
  const maxIndex = Math.max(0, vehicles.length - numCards_d);

  /**
   * Anytime something changes, make sure startIndex doesn't exceed maxIndex.
   */
  useEffect(() => {
    if (startIndex > maxIndex) {
      setStartIndex(maxIndex);
    }
  }, [startIndex, maxIndex]);

  /**
   * Called when user clicks the left or right arrow to scroll.
   */
  const handleScroll = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Move one card to the right, but don't exceed maxIndex
      setStartIndex((prev) => Math.min(prev + 1, maxIndex));
    } else {
      // Move one card to the left, but can't go below zero
      setStartIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  /**
   * Slices out the portion of the array that should be visible.
   */
  const visibleVehicles = vehicles.slice(startIndex, startIndex + numCards_d);

  // If total vehicles <= numCards_d, we won't need to scroll at all
  // But let's keep the logic consistent if we still want to show them all in a row.
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
              showRentalDetailsOnClick={showRentalDetailsOnClick}
            />
          ))}
        </Flex>

        {/* Right Scroll Button */}
        <Flex width="60px" justify="center" align="center">
          {startIndex < maxIndex && (
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
