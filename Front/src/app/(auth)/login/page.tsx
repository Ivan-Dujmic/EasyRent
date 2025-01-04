'use client';

import {
  chakra,
  Box,
  Heading,
  VStack,
  Flex,
  Spacer,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ILogIn } from '@/typings/logIn/logIn.type';

import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { logIn } from '@/mutation/login';
import { useRouter } from 'next/navigation';
import SucessLoginWindow from '@/components/shared/SuccessWidnow/SucessLoginWindow';
import { FcGoogle } from 'react-icons/fc';
import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
  } = useForm<ILogIn>();
  const router = useRouter();

  const { trigger } = useSWRMutation(swrKeys.logIn, logIn, {
    onSuccess: (data) => {
      setLoggedIn(true);
      if (data?.role === 'user') router.push('/YourHomePage');
      else if (data?.role === 'company') router.push('/CompanyHomePage');
    },
    onError: () => {
      setError('email', {
        type: 'manual',
        message: 'This email is not registered',
      });
    },
  });

  const onLogIn = async (data: ILogIn) => {
    clearErrors();
    await trigger(data);
  };

  const boxWidth = useBreakpointValue({
    base: '90vw', // Small screens
    md: '70vw', // Medium screens
  });

  return loggedIn ? (
    <SucessLoginWindow />
  ) : (
    <Box
      width={boxWidth}
      margin="0 auto"
      mt="10"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
    >
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Login
      </Heading>
      <chakra.form onSubmit={handleSubmit(onLogIn)}>
        <VStack spacing={6}>
          <CustomInput
            {...register('email', {
              required: 'Email is required',
            })}
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
          />
          <CustomInput
            {...register('password', {
              required: 'Must enter password',
            })}
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
          />
          {/* Button Layout */}
          <Flex direction="column" gap={4} w="full" align="center">
            {/* Login Button */}
            <SubmitButton
              label="Login"
              submittingLabel="Logging in..."
              isSubmitting={isSubmitting}
              w={{ base: '100%', md: '50%' }}
              mb={{ base: 4, md: 6 }} // Add spacing below the Login button
            />
            {/* Secondary Buttons */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
              w="full"
            >
              <SupportButton
                href="/register/user"
                w={{ base: '100%', md: 'auto', lg: '30%' }}
              >
                Register
              </SupportButton>
              <SupportButton
                href="/home"
                w={{ base: '100%', md: 'auto', lg: '30%' }}
              >
                Continue as Guest
              </SupportButton>
              <SupportButton
                href="https://easyrent-t7he.onrender.com/accounts/google/login/?next=/"
                w={{ base: '100%', md: 'auto', lg: '30%' }}
              >
                <Flex justify="center" align="center" gap={2}>
                  <FcGoogle />
                  <Text whiteSpace="nowrap">Sign in with Google</Text>
                </Flex>
              </SupportButton>
            </Flex>
          </Flex>
        </VStack>
      </chakra.form>
    </Box>
  );
}
