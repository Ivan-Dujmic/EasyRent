'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { CustomPost } from '@/fetchers/post';
import { swrKeys } from '@/fetchers/swrKeys';
import { IRegisterUser } from '@/typings/users/user.type';
import {
  Box,
  VStack,
  Flex,
  chakra,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

export default function RegisterPage() {
  const [registered, setRegistered] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<IRegisterUser>();

  const { trigger } = useSWRMutation(swrKeys.registerUser, CustomPost<IRegisterUser>, {
    onSuccess: () => {
      setRegistered(true);
    },
    onError: () => {
      setError('email', {
        type: 'manual',
        message: 'This account already exists',
      });
    },
  });

  const onRegister = async (data: IRegisterUser) => {
    if (data.password.length < 8) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters',
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    clearErrors();
    await trigger(data);
  };

  const boxWidth = useBreakpointValue({
    base: '90vw', // Small screens
    md: '70vw', // Medium screens
    lg: '50vw', // Large screens
  });

  const inputWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: '48%', // Two columns on medium and large screens
  });

  return registered ? (
    <SuccessWindow />
  ) : (
    <Box
      width={boxWidth}
      margin="0 auto"
      my="10"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
    >
      <chakra.form onSubmit={handleSubmit(onRegister)}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          wrap="wrap"
          gap={6}
          justify="space-between"
        >
          {/* Left Column */}
          <VStack spacing={4} w={inputWidth}>
            <CustomInput
              {...register('firstName', {
                required: 'Must enter your first name',
              })}
              label="First name"
              type="text"
              placeholder="Enter your first name"
              error={errors.firstName?.message}
            />
            <CustomInput
              {...register('lastName', {
                required: 'Must enter your last name',
              })}
              label="Last name"
              type="text"
              placeholder="Enter your last name"
              error={errors.lastName?.message}
            />
            <CustomInput
              {...register('driversLicense', {
                required: "Driver's license is required",
              })}
              label="Driver's license"
              type="text"
              placeholder="Enter your driver's license id"
              error={errors.driversLicense?.message}
            />
          </VStack>

          {/* Right Column */}
          <VStack spacing={4} w={inputWidth}>
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
              {...register('phoneNo', {
                required: 'Phone number is required',
              })}
              label="Phone number"
              type="tel"
              placeholder="Enter your phone number"
              error={errors.phoneNo?.message}
            />
            <CustomInput
              {...register('password', {
                required: 'Must enter password',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
            />
            <CustomInput
              {...register('confirmPassword', {
                required: 'Password confirmation is required',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              })}
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
            />
          </VStack>
        </Flex>

        {/* Buttons */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          mt={6}
          justify="center"
          align="center"
        >
          <SupportButton href="/home" w={{ base: '100%', md: '30%' }}>
            Continue as Guest
          </SupportButton>
          <SupportButton href="/login" w={{ base: '100%', md: '30%' }}>
            Log in
          </SupportButton>
          <SubmitButton
            label="Register"
            submittingLabel="Trying to register..."
            isSubmitting={isSubmitting}
            w={{ base: '100%', md: '30%' }}
          />
        </Flex>
      </chakra.form>
    </Box>
  );
}
