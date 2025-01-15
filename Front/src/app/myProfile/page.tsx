'use client';

import "./style.css"
import VehicleList from '@/components/shared/cars/VechileList/VechileList';
import useSWR from 'swr';
import { swrKeys } from '@/fetchers/swrKeys';
import { CustomGet, IRentals } from '@/fetchers/homeData';
import { FaComments } from 'react-icons/fa';
import React, { useState, useEffect, ReactElement } from 'react';
import {
  Flex,
  Box,
  IconButton,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  useBreakpointValue,
  PositionProps,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay
} from '@chakra-ui/react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcStripe,
} from 'react-icons/fa';
import {CustomHeader as Header} from '@/components/shared/Header/CustomHeader/CustomHeader';
import {HeaderButton, LoginButton} from '@/components/shared/Header/Header';
import ChatbotWidget from '@/components/shared/ChatbotWidget/ChatbotWidget';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import { CloseIcon } from '@chakra-ui/icons';
import CompactFooter from '@/components/shared/Footer/CompactFooter';
import Footer from '@/components/shared/Footer/Footer';
// import LogOutButton from '@/components/shared/auth/LogOutButton/LogOutButton';

const userProfileFooterLinks = {
  quickLinks: [
    { label: 'Home', href: '/home' },
    { label: 'About Us', href: '/home' },
    { label: 'FAQ', href: '/home#faq-section' },
    { label: 'Contact Us', href: '/TalkToUs' },
  ],
  contactInfo: {
    phone: '+385 95 517 1890',
    email: 'support@easyrent.com',
    address: 'Unska ul. 3, 10000, Zagreb',
  },
  socialLinks: [
    { label: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
    { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
    { label: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  ],
  paymentIcons: [FaCcVisa, FaCcMastercard, FaCcStripe],
};

export default function UserProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data } = useSWR(swrKeys.registerUser, CustomGet<IRentals>); // Placeholder for rentals fetcher

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  const headingSize = useBreakpointValue({
    base: '2xl', // Default heading size for laptop/tablet ????? IDK
    lg: '2xl', // Larger heading for desktop
  });

  const rentalswidth = useBreakpointValue({
    base: '100%', // Širina mape za mobilne uređaje i male ekrane
    lg: '80%', // Širina mape za srednje i velike ekrane
  });

  const rentalAllignment = useBreakpointValue({
    base: 'center',
    lg: 'space-between'
  })

  const numCards =
    useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }) || 3;

  return (
    <Flex direction="column" grow={1} bg="brandlightgray" minH="100vh">
      {/* Header */}
      <Header>
        <Text fontSize="md" fontWeight="bold" color="brandblue">
          Balance: €31.42
        </Text>

        <Button
          bgColor={'brandblue'}
          color={'brandwhite'}
          size="sm"
          _hover={{ bg: 'brandyellow', color: 'brandblack',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
        >
          Add funds
        </Button>

        <HeaderButton> Edit profile </HeaderButton>

        <LoginButton log="out"/>
      </Header>
      {/* Main Content */}
      <Box position = "relative" width = "100vw">
        {/* Rentals */}
        <Flex
          mx="auto"
          justify={isChatOpen ? {rentalAllignment} : "center"}
          align="stretch"
          width={{ base: '80vw', lg: '100vw' }}
          p={gapSize}
          gap={gapSize}
          wrap={"nowrap"}
          direction={{ base: 'column', lg: 'row' }}
        >
          {/* Rentals Section */}
          <Flex
            direction="column"
            width={rentalswidth}
            bg="brandwhite"
            boxShadow="base"
            borderRadius="md"
            p={gapSize}
            gap={gapSize}
          >
            <Heading size={headingSize} color="brandblue">
              Your Profile
            </Heading>
            <Divider />
            <VehicleList numCards={numCards} description="Ongoing rentals:" />
            <VehicleList numCards={numCards} description="Previously rented:" />
          </Flex>

          {/* Chats Section */}
          {isChatOpen ? (
            <ChatMenu onClose={toggleChat} isOpen={isChatOpen} chats={
              [
                {name:"Admin"}, 
                {name:"Company 1"}, 
                {name:"Company 2"}, 
                {name:"Company 3"}
              ]
            } />
          ) : (
            <ChatIcon 
              onClick={toggleChat}
              position="absolute"
              right={{base: 5, lg: gapSize}}
              top={gapSize}/>
          )}
        </Flex>
      </Box>
      <Footer links={userProfileFooterLinks}/>
    </Flex>
  );
}

interface IChat {
  name : string
  messages?: string[]
}

function ChatIcon ({
  onClick,
  ...rest
}:ChatIconProps) {
  return <IconButton
    aria-label="Open chat"
    icon={<FaComments />}
    onClick={onClick}
    isRound
    size="lg"
    bg="brandblue"
    color="brandwhite"
    _hover={{ bg: 'brandyellow', color: 'brandblack' }}
    {...rest}
  />
}

interface ChatIconProps extends PositionProps {
  onClick: () => void
}

function ChatButton ({
  name
}:IChat, key : number) {
  return <Button
    key={key}
    size="sm"
    variant="outline"
    color="brandblue"
    justifyContent="flex-start"
    _hover={{ bg: 'brandlightgray' }}
  >{name}</Button>
}

export function ChatMenu({ 
  onClose,
  isOpen,
  chats = []
}:ChatMenuProps) {
  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  const screenSize = useBreakpointValue({ base: 'small', lg: 'large' });

  let content = chats.map((props, index) => ChatButton(props, index))

  return screenSize == "large" ? (
    <Flex
      direction="column"
      width="25%"
      bg="brandwhite"
      boxShadow="base"
      borderRadius="md"
      p={gapSize}
      gap={gapSize}
    >
      <Heading size="md" color="brandblue">
        Chats
      </Heading>
      <Divider />
      <VStack align="stretch" spacing={3}>
        {content}
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
      <ChatbotWidget />
    </Flex>
   ) : (
     <>
        <Drawer isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="brandblue">
                  Chats
                </Heading>
                <IconButton
                  aria-label="Close Chat"
                  icon={<CloseIcon />}
                  variant="ghost"
                  onClick={onClose}
                />
              </Flex>
            </DrawerHeader>
            <Divider />
            <DrawerBody>
              <VStack align="stretch" spacing={4}>
                {content}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
  );
}

interface ChatMenuProps {
  onClose: () => void,
  isOpen: boolean,
  chats?: IChat[]
}