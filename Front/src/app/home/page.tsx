'use client';

import EasyRentMoto from '@/components/core/EasyRentMoto/EasyRentMoto';
import MainFilter from '@/components/shared/filter/MainFilter/MainFilter';
import Header from '@/components/shared/Header/Header';
import CompanyList from '@/components/shared/company/CompanyList/CompanyList';
import { Flex, Heading, useBreakpointValue } from '@chakra-ui/react';
import { mockVehicles } from '@/mockData/mockVehicles';
import VehicleList from '@/components/shared/cards/VechileList/VechileList';
import { AuthRedirect } from '@/components/shared/auth/AuthRedirect/AuthRedirect';
import useSWR from 'swr';
import { swrKeys } from '@/fetchers/swrKeys';
import { getShowCaseds } from '@/fetchers/homeData';
import FQA from '@/components/shared/info/FQA/FQA';
import BenefitsSection from '@/components/shared/BenefitsSection/BenefitsSection';
import Footer from '@/components/shared/Footer/Footer';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcStripe,
} from 'react-icons/fa';
import CustomMap from '@/components/shared/Map/CustomMap/CustomMap';
import { dealershipLocations } from '@/mockData/mockLocations';

const homeGuestFooterLinks = {
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

export default function HomePage() {
  const { data, error, isLoading } = useSWR(swrKeys.showcased, getShowCaseds);

  const gapSize = useBreakpointValue({
    base: 8, // Small gap for small screens (mobile)
    md: 10, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  const headingSize = useBreakpointValue({
    base: '2xl', // Default heading size for laptop/tablet
    sm: '3xl', // Larger heading for desktop
    md: '4xl',
  });

  const mapWidth = useBreakpointValue({
    base: '80vw', // Širina mape za mobilne uređaje i male ekrane
    md: '60vw', // Širina mape za srednje i velike ekrane
  });

  return (
    <>
      <AuthRedirect to={''} condition={'isLoggedIn'} />
      <Flex direction="column" grow={1} align={'center'} width={'100%'}>
        <Header />
        {/* Drugi dio stranice */}
        <Flex
          bg="brandlightgray"
          minHeight="300px"
          color="brandblue"
          direction={'column'}
          align={'center'}
          justify={'flex-start'}
          py={gapSize}
          gap={gapSize}
          width={'100%'}
        >
          <EasyRentMoto />
          <MainFilter />
          <Flex gap={gapSize} align={'center'} px={5}>
            <Heading fontSize={headingSize} color={'brandblue'}>
              Trusted by the Best:
            </Heading>
            <CompanyList companies={data?.showcased_dealerships} />
          </Flex>
        </Flex>

        {/* Dio stranice sa Listom automobila */}
        <Flex
          justify={'center'}
          align={'center'}
          direction={'column'}
          py={8}
          gap={2}
        >
          <VehicleList
            vehicles={data?.most_popular}
            description={'Most popular:'}
          />
          <VehicleList
            vehicles={data?.best_value}
            description={'Best value:'}
          />
        </Flex>

        {/* Dio stranice sa benefitima */}
        <Flex justify={'center'} align={'center'} py={8} gap={2}>
          <BenefitsSection />
        </Flex>

        {/* dio stranice s mapom */}
        <Flex
          justify={'center'}
          align={'center'}
          py={8}
          gap={7}
          width={mapWidth}
          direction={'column'}
        >
          <Heading size="lg" color="brandblack" alignSelf="flex-start">
            Explore Dealerships:
          </Heading>
          <CustomMap locations={dealershipLocations} showInfoWindow={true} />
        </Flex>

        {/* Dio stranice sa dodatnim informacijama */}
        <Flex
          justify={'center'}
          align={'center'}
          py={8}
          gap={2}
          id="faq-section"
        >
          <FQA />
        </Flex>

        {/* footer */}
        <Footer links={homeGuestFooterLinks} />
      </Flex>
    </>
  );
}
