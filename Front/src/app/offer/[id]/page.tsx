'use client';

import VehicleOfferCard from '@/components/shared/cars/VehicleOfferCard/VehicleOfferCard';
import Footer from '@/components/shared/Footer/Footer';
import AuthUserHeader from '@/components/shared/Header/AuthUserHeader/AuthUserHeader';
import Header from '@/components/shared/Header/Header';
import CustomMap from '@/components/shared/Map/CustomMap/CustomMap';
import BookingForm from '@/components/shared/offer/BookingForm/BookingForm';
import BookingLoginPrompt from '@/components/shared/offer/BookingLoginPrompt/BookingLoginPrompt';
import { ReviewList } from '@/components/shared/review/ReviewList/ReviewList';
import { useUserContext } from '@/context/UserContext/UserContext';
import { dealershipLocations } from '@/mockData/mockLocations';
import { mockOffer } from '@/mockData/mockOffer';
import { mockReviews } from '@/mockData/mockReviews';
import { Box, Flex, Heading, useBreakpointValue } from '@chakra-ui/react';
import {
  FaCcMastercard,
  FaCcStripe,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa';

const FooterLinks = {
  quickLinks: [
    { label: 'Home', href: '/home' },
    { label: 'About Us', href: '/TalkToUs' },
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

export default function OfferPage() {
  const { user } = useUserContext();

  const containerWidth = useBreakpointValue({
    base: '90%', // Width for mobile devices
    sm: '85%', // Width for tablets
    md: '80%', // Width for medium-sized screens
    lg: '80%', // Width for larger screens
    xl: '80%', // Width for extra-large screens
  });

  return (
    <Flex
      direction="column"
      grow={1}
      align={'center'}
      width={'100%'}
      gap={5}
      justifyContent={'flex-start'}
    >
      {/* Conditional Header Based on User Role */}
      {user.role === 'user' && <AuthUserHeader UserData={user} />}
      {user.role !== 'user' && <Header />}

      {/* Offer Section */}
      <Flex
        justify={'flex-start'}
        align={'flex-start'}
        direction={'column'}
        width={containerWidth}
        my={6}
        gap={5}
      >
        <Heading size={'lg'} color="brandblack" alignSelf="flex-start">
          Your Offer:
        </Heading>
        <Flex
          direction={'row'}
          gap={{ base: 6, md: 8 }} // Adjust spacing for mobile vs. desktop
          align="flex-start"
          justify="center"
          width="100%"
          wrap={'wrap'}
        >
          {/* Offer Card */}
          <VehicleOfferCard vehicle={mockOffer} />

          {/* Booking Form */}
          {user.role !== 'user' && <BookingForm balance={mockOffer.price} />}
          {user.role === 'user' && <BookingLoginPrompt />}
        </Flex>
      </Flex>

      {/* Booking Form & Map Section */}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        width={containerWidth}
        gap={10}
        justify="center"
        align="flex-start"
        wrap={'wrap'}
      >
        {/* Map Section */}
        <Box flex="1" width={{ base: '100%', lg: '65%' }}>
          <Heading fontSize="2xl" color={'brandblack'} mb={5}>
            Pickup Locations:
          </Heading>
          {/* Map Component */}
          <CustomMap locations={dealershipLocations} showInfoWindow={true} />
        </Box>

        {/* Reviews section */}
        <Box flex="1" width={{ base: '100%', lg: '50%' }}>
          <Heading fontSize="2xl" color={'brandblack'} mb={5}>
            Reviews:
          </Heading>
          {/* reviews */}
          <ReviewList reviews={mockReviews} />
        </Box>
      </Flex>

      {/* footer */}
      <Footer links={FooterLinks} />
    </Flex>
  );
}
