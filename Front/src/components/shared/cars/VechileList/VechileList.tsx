'use client';

import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import VehicleCard from '../VehicleCard/VechileCard';
import { ICar } from '@/fetchers/homeData';
import { FlexProps } from '@chakra-ui/react';

interface VehicleListProps extends FlexProps {
  vehicles?: Array<ICar>;
  description?: string;
}

export default function VehicleList({
  vehicles = [],
  description = undefined,
  width = "75%",	
  ...props
}: VehicleListProps) {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const [isEndOfList, setIsEndOfList] = useState(true);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, vehicles.length);
  }, [vehicles]);

  const handleScroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'right' ? startIndex + 1 : startIndex - 1;
    if (newIndex >= 0 && newIndex < vehicles.length) {
      setStartIndex(newIndex);
      cardRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsEndOfList(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      threshold: 1.0,
    });

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, [observerCallback]);

  return (
    <Flex direction="column" align="center" width={width} {...props}>
      {description && (
        <Heading size="md" color="brandblack" alignSelf="flex-start">
          {description}
        </Heading>
      )}
      <Flex position="relative" justify="center" align="center" width="100%" mb={2}>
        {startIndex > 0 && (
          <IconButton
            position="absolute"
            left="1vmax"
            aria-label="Scroll left"
            icon={<FaChevronLeft />}
            onClick={() => handleScroll('left')}
            isRound
          />
        )}
        <Flex ref={containerRef} overflow="hidden" gap={3} width="80%" px={2} py={3}>
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
                if (index === vehicles.length - 1) {
                  lastElementRef.current = el;
                }
              }}
              style={{ flex: '0 0 auto', width: '200px' }} // Set a fixed width for each card
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </Flex>
        {!isEndOfList && (
          <IconButton
            position="absolute"
            right="1vmax"
            aria-label="Scroll right"
            icon={<FaChevronRight />}
            onClick={() => handleScroll('right')}
            isRound
          />
        )}
      </Flex>
    </Flex>
  );
}