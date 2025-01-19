'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import SuccessWindowCompany from '@/components/shared/SuccessWidnow/SuccessWinodwCompany';
import WorkingHoursForm from '@/components/shared/auth/WorkingHoursForm';
import { swrKeys } from '@/fetchers/swrKeys';
import { IRegisterCompany } from '@/typings/company/company.type';
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
import { CustomPost } from '@/fetchers/post';

export default function RegisterCompanyPage() {
  const [registered, setRegistered] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<IRegisterCompany>();

  const { trigger } = useSWRMutation(swrKeys.registerCompany, CustomPost<IRegisterCompany>, {
    onSuccess: () => {
      setRegistered(true);
    },
    onError: () => {
      setError('email', {
        type: 'manual',
        message: 'This Company is already registered',
      });
    },
  });

  const onRegister = async (data: IRegisterCompany) => {
    clearErrors();
    await trigger(data);
  };

  const boxWidth = useBreakpointValue({
    base: '90vw', // Small screens
    md: '70vw', // Medium screens
    lg: '50vw', // Large screens
  });

  const inputWidth = useBreakpointValue({
    base: '100%', // Full width for small screens
    md: '48%', // Half width for medium and larger screens
  });

  return registered ? (
    <SuccessWindowCompany />
  ) : (
    <Box
      width={boxWidth}
      margin="0 auto"
      mt="8"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
      mb={12}
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
              {...register('name', {
                required: 'Must enter company name',
              })}
              label="Company Name"
              type="text"
              placeholder="Enter company name"
              error={errors.name?.message}
            />
            <CustomInput
              {...register('email', {
                required: 'Email is required',
              })}
              label="Company Email"
              type="email"
              placeholder="Enter company email"
              error={errors.email?.message}
            />
            <CustomInput
              {...register('phoneNo', {
                required: 'Phone number is required',
              })}
              label="Phone Number"
              type="tel"
              placeholder="Enter company phone number"
              error={errors.phoneNo?.message}
            />
            <CustomInput
              {...register('HQaddress', {
                required: 'Main company address is required',
              })}
              label="HQ Address"
              type="text"
              placeholder="Enter company address"
              error={errors.HQaddress?.message}
            />
            <CustomInput
              {...register('TIN', {
                required: 'TIN is required',
              })}
              label="TIN"
              type="text"
              placeholder="Enter company TIN"
              error={errors.TIN?.message}
            />
          </VStack>

          {/* Right Column */}
          <VStack spacing={4} w={inputWidth}>
            <WorkingHoursForm />
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
              placeholder="Enter password"
              error={errors.password?.message}
            />
            <CustomInput
              {...register('confirmPassword', {
                required: 'Password confirmation is required',
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              })}
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
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
          <SupportButton href="/" w={{ base: '100%', md: '30%' }}>
            Continue as Guest
          </SupportButton>
          <SupportButton href="/login" w={{ base: '100%', md: '30%' }}>
            Log In
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
