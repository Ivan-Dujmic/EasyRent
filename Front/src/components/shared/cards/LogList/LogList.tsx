"use client";

import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import React, { useState } from 'react';
import LogCard from '../LogCard/LogCard';
import { useBreakpointValue } from '@chakra-ui/react';
import { ILog } from '@/fetchers/homeData';

interface LogListProps {
  logs: Array<ILog> | undefined;
  description: string;
  useDescription: Boolean;
}

export default function LogList({
  logs,
  description,
  useDescription,
}: LogListProps) {
  const [startIndex, setStartIndex] = useState(0);
  const sliceSize = useBreakpointValue({ base: 4, xl: 5 });

  const handleScroll = (direction: 'left' | 'right') => {
    const totalLogs = logs?.length;
    const maxIndex = totalLogs ? totalLogs - 5 : 5; // Maksimalni početni indeks za prikaz 5 vozila; !!! nes sam bezvze dodo projmejnit ako treba
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
          {logs
            ?.slice(startIndex, startIndex + (sliceSize || 4))
            .map((log, index) => (
              <LogCard key={index} log={log} />
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
