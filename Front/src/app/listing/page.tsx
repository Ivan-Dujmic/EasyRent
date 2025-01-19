'use client';

import EasyRentMoto from '@/components/core/EasyRentMoto/EasyRentMoto';
import { VehicleGrid } from '@/components/shared/cars/VehicleGrid/VehicleGrid';
import ChatbotWidget from '@/components/shared/ChatbotWidget/ChatbotWidget';
import MainFilter from '@/components/shared/filter/MainFilter/MainFilter';
import SideFilter from '@/components/shared/filter/SideFilter/SideFilter';
import Footer from '@/components/shared/Footer/Footer';
import AuthUserHeader from '@/components/shared/Header/AuthUserHeader/AuthUserHeader';
import Header from '@/components/shared/Header/Header';
import { useCarContext } from '@/context/CarContext';
import { useUserContext } from '@/context/UserContext/UserContext';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcStripe,
} from 'react-icons/fa';

const ListinGuestFooterLinks = {
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

export default function ResultsPage() {
  const { cars } = useCarContext();
  const { user } = useUserContext();

  // Check if cars are still being loaded from localStorage
  if (cars === null) {
    return (
      <Flex justify="center" align="center" minHeight="50vh" width={'100%'}>
        <Spinner size="xl" color="brandblue" />
        <Text ml={4} fontSize="lg">
          Loading offers...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" grow={1} align={'center'} width={'100%'}>
      {user.role === 'user' && <AuthUserHeader UserData={user} />}
      {user.role !== 'user' && <Header />}
      {/* Drugi dio stranice */}
      <Flex
        bg="brandlightgray"
        minHeight="300px"
        color="brandblue"
        direction={'column'}
        align={'center'}
        justify={'center'}
        py={8}
        gap={8}
        width={'100%'}
      >
        <EasyRentMoto />
        <MainFilter />
      </Flex>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        py={10}
        gap={10}
        width={'81vw'}
        align={{ base: 'center', md: 'flex-start' }}
        justify={{ base: 'center', md: 'space-between' }}
      >
        <Box
          flexShrink={0}
          width={{ base: '100%', md: '25%' }}
          display="flex"
          justifyContent="center"
        >
          <SideFilter />
        </Box>
        <Box
          flexGrow={1}
          width={{ base: '100%', md: '75%' }}
          display={{ base: 'flex', md: 'block' }}
          justifyContent={{ base: 'center', md: 'flex-start' }}
        >
          {cars.length > 0 ? (
            <VehicleGrid vehicles={cars} />
          ) : (
            <Text fontSize="xl" color="brandblue">
              No cars found. Please try searching again.
            </Text>
          )}
        </Box>
      </Flex>
      <ChatbotWidget />
      <Footer links={ListinGuestFooterLinks} />
    </Flex>
  );
}
