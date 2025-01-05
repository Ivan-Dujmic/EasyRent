'use client';

import "./style.css"
import { CustomHeader as Header } from '@/components/shared/Header/Header';
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
  Button
} from '@chakra-ui/react';

export default function UserProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data } = useSWR(swrKeys.registerUser, get<IRentals>); //no clue sto je registerUser, vjv treba promjenit

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Flex direction="column" grow={1}>
      {/* Header */}
      <Header>
        <Text fontSize="md">Balance: €31.42</Text>
        <Button bgColor={"brandblue"} color={"brandwhite"} size = "sm" _hover={{ bg: 'brandyellow' }}>
          Add funds
        </Button>
        <Button
          bg={'brandblue'}
          color={'brandwhite'}
          fontWeight={'normal'}
          fontSize="sm"
          size="sm"
          _hover={{
            bg: 'brandblue',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
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
            bg: 'brandblue',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
        >
          Logout
        </Button>
      </Header>
      
      <Flex mx="auto" justify={isChatOpen ? "space-between" : "center"} align={'center'} width={'90vw'} height={"100%"} p='1vmax'>
        {/* Rentals */}
        <Flex position="relative" alignSelf="center" px="1vmax" direction={'column'} width="60vw" height="100%" justify={'space-evenly'} bg="brandlightgray" boxShadow={'base'} align={"center"}>
          {!isChatOpen &&
            <IconButton
              position="absolute"
              top="1vmax"
              right="-5vmax"
              aria-label="Open chat"
              icon={<FaComments />}
              onClick={toggleChat}
              isRound
              size="lg"
            />
          }
          <Heading size="lg">Your Profile</Heading>
          <VehicleList vehicles={sample1} description='Ongoing rentals:'/>
          <VehicleList vehicles={sample2} description='Previously rented:' numCards={3}/>
        </Flex>  
        {/* Chats Section */}
        {isChatOpen && (
          <Chat onClose={toggleChat} />
        )}
      </Flex>
    </Flex>
  );
}

function Chat({ onClose }: { onClose: () => void }) {
  return (
    <Flex
      height={"100%"}
      bg="brandlightgray"
      width="20vw"
      direction="column"
      p={5}
      gap={3}
      boxShadow="base"
    >
      <Heading size="sm">Chats</Heading>
      {['Admin', 'Company1', 'Company2', 'Company3'].map((chat, index) => (
        <Button key={index} size="sm" variant="ghost" justifyContent="flex-start">
          {chat}
        </Button>
      ))}
      <Button onClick={onClose} mt={3} size="sm" variant="ghost">
        Close
      </Button>
    </Flex>
  );
}

let amoguscar = { companyName: "amogus", image: "sus", makeName: "amogubil", modelName: "amongus" };
let amoguscar2 = { companyName: "sus", image: "sus2", makeName: "amogubil2", modelName: "amongus maximus" };
let sample1 = [amoguscar, amoguscar];
let sample2 = [amoguscar, amoguscar, amoguscar, amoguscar, amoguscar, amoguscar2];