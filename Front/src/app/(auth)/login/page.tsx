'use client';

import {
  chakra,
  Box,
  Heading,
  VStack,
  Flex,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ILogIn } from '@/typings/logIn/logIn.type';
import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { useRouter } from 'next/navigation';
import SucessLoginWindow from '@/components/shared/SuccessWidnow/SucessLoginWindow';
import { FcGoogle } from 'react-icons/fc';
import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import { useRef } from 'react';
import { CustomPost } from '@/fetchers/post';
export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
  } = useForm<ILogIn>();
  const router = useRouter();

  const { trigger } = useSWRMutation(swrKeys.logIn, CustomPost<ILogIn>, {
    onSuccess: (data) => {
      if (data?.success == 1)
        localStorage.setItem('userData', JSON.stringify(data));
      router.push('/SuccessfulLogin');
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
    lg: '50vw', // Large screens
  });

  const buttonWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: '32%', // Fit three buttons side by side on medium screens
    lg: '30%', // Slightly smaller on large screens for spacing
  });

  return (
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
          {/* Input Fields */}
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
          <Flex
            direction="column"
            gap={6}
            w="full"
            align="center"
            justify="center"
          >
            {/* Login Button */}
            <SubmitButton
              label="Login"
              submittingLabel="Logging in..."
              isSubmitting={isSubmitting}
              w={{ base: '100%', md: '50%' }}
            />

            {/* Secondary Buttons */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={4}
              w="full"
              justify="center"
              align="center"
            >
              <SupportButton href="/register/user" w={buttonWidth}>
                Register
              </SupportButton>
              <SupportButton href="/home" w={buttonWidth}>
                Continue as Guest
              </SupportButton>
              <SupportButton
                href="https://easyrent-t7he.onrender.com/accounts/google/login/?next=https://easy-rent-ashy.vercel.app/SuccessfulLogin"
                // href="http://127.0.0.1:8000/accounts/google/login/?next=/api/auth/SuccessfulLogin"
                w={buttonWidth}
              >
                <Flex justify="center" align="center" gap={2}>
                  <FcGoogle />
                  <Text whiteSpace="nowrap">Sign in with Google</Text>
                </Flex>
              </SupportButton>
              {/* <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} /> */}
            </Flex>
          </Flex>
        </VStack>
      </chakra.form>
    </Box>
  );
}
