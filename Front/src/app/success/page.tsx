'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import {
  Flex,
  VStack,
  Heading,
  Text,
  Spinner,
  Button,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { CustomGet } from '@/fetchers/get';
import { swrKeys } from '@/fetchers/swrKeys';

interface PaymentResponse {
  paymentStatus?: string;
}

export default function SuccessPage() {
  const router = useRouter();

  // Stanja za "status" i "poruku" koja prikazujemo u interfejsu
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [transId, setTransId] = useState('');

  /**
   * useSWRMutation - prvi argument je "cache key" (ovde proizvoljno '/checkTransactionKey'),
   * drugi argument je naša asinhrona funkcija (fetcher).
   */
  const { trigger, isMutating } = useSWRMutation<PaymentResponse>(
    swrKeys.checkTransaction(transId),
    CustomGet
  );

  /**
   * U useEffect:
   * 1. Uzimamo trans_id iz localStorage.
   * 2. Ako ne postoji => greška.
   * 3. Ako postoji => čekamo 2s, pa zovemo 'trigger(transId)' i
   *    analiziramo odgovor => success ili error.
   */
  useEffect(() => {
    const transId = localStorage.getItem('trans_id');

    if (!transId) {
      setStatus('error');
      setMessage(
        'No transaction ID found. Please go back and try again or contact us.'
      );
      return;
    }
    // ako psotoji:
    setTransId(transId);
    const timer = setTimeout(() => {
      setStatus('loading');

      // Pozivamo trigger iz useSWRMutation i prosleđujemo transId kao arg
      trigger()
        .then((res) => {
          // Prilagodi uslov zavisno od strukture odgovora (npr. paymentStatus === 'successful payment')
          if (res && res.paymentStatus === 'successful payment') {
            setStatus('success');
            setMessage(
              'You have successfully completed your transaction. Check your email for more info.'
            );
          } else {
            setStatus('error');
            setMessage(
              'Your transaction did not succeed. You can try again or contact us for help.'
            );
          }
        })
        .catch((err) => {
          setStatus('error');
          setMessage(
            'Something went wrong while checking your transaction. Please try again later.'
          );
        });
    }, 2000);

    // Čišćenje 'timer'-a ako korisnik napusti stranicu pre isteka
    return () => clearTimeout(timer);
  }, [trigger]);

  // Prikaz UI prema statusu
  return (
    <Flex
      width={'100vw'}
      height={'100vh'}
      textAlign="center"
      justify="center"
      bg={'brandlightgray'}
    >
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
          {/* Stanje dok nismo krenuli ili baš u momentu "mutating" */}
          {(status === 'idle' || isMutating) && (
            <>
              <Heading as="h2" size="lg" color="brandblack" fontWeight="bold">
                Finalizing Your Transaction
              </Heading>
              <Text fontSize="md" color="brandgray" textAlign="center">
                Please wait while we verify your payment...
              </Text>
              <Spinner
                size="xl"
                color="brandblue"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
              />
            </>
          )}

          {/* Ako je transakcija uspješna */}
          {status === 'success' && (
            <>
              <Icon as={CheckCircleIcon} w={12} h={12} color="brandyellow" />
              <Heading as="h2" size="lg" color="brandblack" fontWeight="bold">
                Transaction Successful! 🎉
              </Heading>
              <Text fontSize="md" color="brandgray" textAlign="center">
                {message}
              </Text>
              <Button
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
                onClick={() => router.push('/myProfile')}
              >
                Go to your profile
              </Button>
            </>
          )}

          {/* Ako je transakcija neuspješna */}
          {status === 'error' && (
            <>
              <Icon as={WarningTwoIcon} w={12} h={12} color="red.500" />
              <Heading as="h2" size="lg" color="brandblack" fontWeight="bold">
                Transaction Failed 😞
              </Heading>
              <Text fontSize="md" color="brandgray" textAlign="center">
                {message}
              </Text>
              <Button
                bg="brandyellow"
                color="brandblack"
                fontWeight="semibold"
                fontSize="md"
                size="md"
                _hover={{
                  bg: 'brandblue',
                  color: 'white',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onClick={() => router.push('/TalkToUs')}
              >
                Talk to us
              </Button>
            </>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
}
