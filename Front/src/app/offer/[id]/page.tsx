'use client';

import VehicleOfferCard from '@/components/shared/cars/VehicleOfferCard/VehicleOfferCard';
import AuthUserHeader from '@/components/shared/Header/AuthUserHeader/AuthUserHeader';
import Header from '@/components/shared/Header/Header';
import BookingForm from '@/components/shared/offer/BookingForm/BookingForm';
import { useUserContext } from '@/context/UserContext/UserContext';
import { mockOffer } from '@/mockData/mockOffer';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Select,
  Stack,
  Input,
} from '@chakra-ui/react';

export default function OfferPage() {
  const { user } = useUserContext();

  return (
    <Flex direction="column" grow={1} align={'center'} width={'100%'} gap={10}>
      {user.role === 'user' && <AuthUserHeader UserData={user} />}
      {user.role !== 'user' && <Header />}
      {/* Drugi dio stranice */}

      {/* Content */}
      <VehicleOfferCard vehicle={mockOffer} />
    </Flex>
  );
}
