'use client';

import MovingCars from '@/animations/MovingCars/MovingCars';
import { AuthRedirect } from '@/components/shared/auth/AuthRedirect/AuthRedirect';
import { Flex, Heading, Text, Image } from '@chakra-ui/react';

export default function CompanyHomePage() {
  return (
    <>
      <AuthRedirect to={'/login'} condition={'isLoggedOut'} />
      <AuthRedirect to={''} condition={'isLoggedIn'} RedIfRole={'user'} />
      <Flex
        justify={'center'}
        align={'center'}
        direction={'column'}
        gap={4}
        bg={'brandwhite'}
        grow={1}
      >
        <Heading color={'brandblue'} fontSize={'3rem'}>
          COMING SOON
        </Heading>
        <Text color={'brandyellow'} fontSize={'1rem'}>
          Our website is under construction
        </Text>
        <MovingCars />
      </Flex>
    </>
  );
}
