'use client';

import './style.css';
import VehicleList from '@/components/shared/cars/VechileList/VechileList';
import useSWR from 'swr';
import { swrKeys } from '@/fetchers/swrKeys';
import { get, IRentals } from '@/fetchers/homeData';
import { FaComments } from 'react-icons/fa';
import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Heading,
  Text,
  Button,
  Box,
  VStack,
  Divider,
} from '@chakra-ui/react';
import CustomHeader from '@/components/shared/Header/CustomHeader/CustomHeader';

export default function UserProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data } = useSWR(swrKeys.registerUser, get<IRentals>); // Placeholder for rentals fetcher

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Flex direction="column" grow={1} bg="brandlightgray" minH="100vh">
      {/* Header */}
      <CustomHeader>
        <Text fontSize="md" fontWeight="bold" color="brandblue">
          Balance: €31.42
        </Text>
        <Button
          bgColor={'brandblue'}
          color={'brandwhite'}
          size="sm"
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        >
          Add funds
        </Button>
        <Button
          bg={'brandblue'}
          color={'brandwhite'}
          fontWeight={'normal'}
          fontSize="sm"
          size="sm"
          _hover={{
            bg: 'brandyellow',
            color: 'brandblack',
          }}
        >
          Edit profile
        </Button>
        <Button
          bg={'brandblue'}
          color={'brandwhite'}
          fontWeight={'normal'}
          fontSize="sm"
          size="sm"
          _hover={{
            bg: 'brandyellow',
            color: 'brandblack',
          }}
        >
          Logout
        </Button>
      </CustomHeader>

      {/* Main Content */}
      <Flex
        mx="auto"
        justify="space-between"
        align="stretch"
        width="90vw"
        height="auto"
        p="2vmax"
        gap={5}
        direction={{ base: 'column', lg: 'row' }}
      >
        {/* Rentals Section */}
        <Flex
          direction="column"
          width={{ base: '100%', lg: '70%' }}
          bg="brandwhite"
          boxShadow="base"
          borderRadius="md"
          p={5}
          gap={6}
        >
          <Heading size="lg" color="brandblue" textAlign="center">
            Your Profile
          </Heading>
          <Divider />
          <VehicleList vehicles={sample1} description="Ongoing rentals:" />
          <VehicleList vehicles={sample2} description="Previously rented:" />
        </Flex>

        {/* Chats Section */}
        {isChatOpen ? (
          <Chat onClose={toggleChat} />
        ) : (
          <IconButton
            aria-label="Open chat"
            icon={<FaComments />}
            onClick={toggleChat}
            isRound
            size="lg"
            bg="brandblue"
            color="brandwhite"
            _hover={{ bg: 'brandyellow', color: 'brandblack' }}
            alignSelf={{ base: 'center', lg: 'flex-start' }}
          />
        )}
      </Flex>
    </Flex>
  );
}

function Chat({ onClose }: { onClose: () => void }) {
  return (
    <Flex
      direction="column"
      width={{ base: '100%', lg: '25%' }}
      bg="brandwhite"
      boxShadow="base"
      borderRadius="md"
      p={5}
      gap={4}
    >
      <Heading size="md" color="brandblue">
        Chats
      </Heading>
      <Divider />
      <VStack align="stretch" spacing={3}>
        {['Admin', 'Company1', 'Company2', 'Company3'].map((chat, index) => (
          <Button
            key={index}
            size="sm"
            variant="outline"
            color="brandblue"
            justifyContent="flex-start"
            _hover={{ bg: 'brandlightgray' }}
          >
            {chat}
          </Button>
        ))}
      </VStack>
      <Button
        onClick={onClose}
        mt={3}
        size="sm"
        variant="solid"
        bg="brandblue"
        color="brandwhite"
        _hover={{ bg: 'brandyellow', color: 'brandblack' }}
      >
        Close
      </Button>
    </Flex>
  );
}

let amoguscar = {
  companyName: 'amogus',
  image: 'sus',
  makeName: 'amogubil',
  modelName: 'amongus',
};
let amoguscar2 = {
  companyName: 'sus',
  image: 'sus2',
  makeName: 'amogubil2',
  modelName: 'amongus maximus',
};
let sample1 = [amoguscar, amoguscar];
let sample2 = [
  amoguscar,
  amoguscar,
  amoguscar,
  amoguscar,
  amoguscar,
  amoguscar2,
];
