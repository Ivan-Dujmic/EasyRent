'use client';

import EasyRentMoto from '@/components/core/EasyRentMoto/EasyRentMoto';
import { VehicleGrid } from '@/components/shared/cars/VehicleGrid/VehicleGrid';
import MainFilter from '@/components/shared/filter/MainFilter/MainFilter';
import SideFilter from '@/components/shared/filter/SideFilter/SideFilter';
import Footer from '@/components/shared/Footer/Footer';
import Header from '@/components/shared/Header/Header';
import { useCarContext } from '@/context/CarContext';
import { mockVehicles } from '@/mockData/mockVehicles';
import { Box, Text, Image, Flex, useBreakpointValue } from '@chakra-ui/react';
import {
  FaCcMastercard,
  FaCcStripe,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
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

  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  /*   if (!cars) {
    return <Text>No results found.</Text>;
  } */

  return (
    <Flex direction="column" grow={1} align={'center'} width={'100%'}>
      <Header />
      {/* Drugi dio stranice */}
      <Flex
        bg="brandlightgray"
        minHeight="300px"
        color="brandblue"
        direction={'column'}
        align={'center'}
        justify={'center'}
        py={gapSize}
        gap={gapSize}
        width={'100%'}
      >
        <EasyRentMoto />
        <MainFilter />
      </Flex>

      <Flex
        direction={'row'}
        py={10}
        gap={10}
        width={'80vw'}
        align={'flex-start'}
      >
        <SideFilter />
        <VehicleGrid vehicles={mockVehicles} />
      </Flex>

      <Footer links={ListinGuestFooterLinks} />
    </Flex>
  );
}
