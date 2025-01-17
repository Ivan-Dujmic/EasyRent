'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import {
  VStack,
  Text,
  Button,
  Spinner,
  Heading,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { User, useUserContext } from '@/context/UserContext/UserContext';
import { CustomGet } from '@/fetchers/get';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { swrKeys } from '@/fetchers/swrKeys';

export default function SuccessfulLogin() {
  const router = useRouter();
  const { setUser } = useUserContext();

  // Koristimo useSWR za dohvat podataka o korisniku
  const { data, error, isValidating } = useSWR(
    swrKeys.userinfo,
    CustomGet<User>,
    {
      revalidateOnFocus: false,
    }
  );

  // Kada se podaci uspešno dohvate, spremamo ih u kontekst
  useEffect(() => {
    if (data) {
      setUser(data); // Sprema korisničke podatke u kontekst
      if (data.role === 'company') {
        router.push('/CompanyHomePage'); // Ako je guest, preusmerite ga na početnu stranicu
      } else {
        router.push('/home'); // Ili ga preusmerite na odgovarajuću stranicu
      }
    }
  }, [data, router, setUser]);

  // Ako je došlo do greške
  if (error) {
    return (
      <Flex
        bg="brandwhite"
        w="100%"
        maxW="600px"
        p={6}
        borderRadius="md"
        boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
        textAlign="center"
        justify="center"
        align="center"
        margin="0 auto"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <VStack spacing={6}>
          <Heading size="lg" color="brandblack" fontWeight="bold">
            Something went wrong 😞
          </Heading>
          <Text fontSize="md" color="brandgray" textAlign="center">
            We couldn `&apos;`t access your data. Please try again later or
            contact us for help.
          </Text>
          <Button
            as="a"
            bg="brandblue"
            color="white"
            fontWeight="semibold"
            fontSize="md"
            size="md"
            _hover={{
              bg: 'brandyellow',
              color: 'brandblack',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease',
            }}
            href="/TalkToUs"
          >
            Talk to us
          </Button>
        </VStack>
      </Flex>
    );
  }

  // Prikaz tokom učitavanja
  if (isValidating || !data) {
    return (
      <Flex
        bg="brandwhite"
        w="100%"
        maxW="600px"
        p={6}
        py={16}
        borderRadius="md"
        boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
        textAlign="center"
        justify="center"
        align="center"
        margin="0 auto"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <VStack spacing={6}>
          <Icon as={CheckCircleIcon} w={10} h={10} color="brandyellow" />
          <Heading as="h2" color="brandBlue" fontSize="2xl">
            You have successfully logged in! 🎉
          </Heading>
          <Text fontSize="lg" color="brandblack" mb={5}>
            We are fetching your data, please wait a moment...
          </Text>
          <Spinner
            size="xl"
            color="brandblue"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
          />
        </VStack>
      </Flex>
    );
  }

  // Povratna vrednost kada se podaci učitaju
  return null; // Nećemo nikada ovde ostati jer `useEffect` preusmerava korisnika
}
