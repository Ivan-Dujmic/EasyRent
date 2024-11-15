'use client';

import MovingCars from '@/animations/MovingCars/MovingCars';
import { AuthRedirect } from '@/components/shared/auth/AuthRedirect/AuthRedirect';
import { Flex, Heading, Text, Image, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function CompanyHomePage() {
  const router = useRouter();
  return (
    <>
      {/*       <AuthRedirect to={'/login'} condition={'isLoggedOut'} />
      <AuthRedirect to={''} condition={'isLoggedIn'} RedIfRole={'user'} /> */}
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
        <Button
          bg={'brandblue'}
          color={'brandwhite'}
          fontWeight={'semibold'}
          fontSize="lg"
          size="lg"
          _hover={{
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
          onClick={() => {
            localStorage.removeItem('userData');
            router.push('/home');
          }}
        >
          Log out
        </Button>
        <MovingCars />
      </Flex>
    </>
  );
}
