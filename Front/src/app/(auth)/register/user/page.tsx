'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { swrKeys } from '@/fetchers/swrKeys';
import { registerUser } from '@/mutation/auth';
import { IRegisterUser } from '@/typings/users/user.type';
import {
  Box,
  VStack,
  Flex,
  Spacer,
  chakra,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

export default function HomePage() {
  const [registered, setRegistered] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<IRegisterUser>();

  const { trigger } = useSWRMutation(swrKeys.registerUser, registerUser, {
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
    // Clear previous errors if any
    clearErrors();
    console.log('On register:', data);
    await trigger(data);
  };

  return registered ? (
    <SuccessWindow />
  ) : (
    <Box
      minWidth="800px"
      maxW="1200px"
      w="80vw"
      margin="0 auto"
      mt='10'
      p="6"
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
    >
      <chakra.form onSubmit={handleSubmit(onRegister)}>
        <Flex justifyContent="space-between">
          <VStack spacing="4" w="45%">
            <CustomInput
					  	{...register('firstName', {
					  		required: "Must enter your first name",
					  	})}
					  	label = "First name"
					  	type="text"
					  	placeholder="Enter your first name"
					  	error={errors.firstName?.message}
					  /> 
            <CustomInput
					  	{...register('lastName', {
					  		required: "Must enter your last name",
					  	})}
					  	label = "Last name"
					  	type="text"
					  	placeholder="Enter your last name"
					  	error={errors.lastName?.message}
					  />
            <CustomInput
					  	{...register('driversLicense', {
					  		required: "Driver's license is required",
					  	})}
					  	label = "Driver's license"
					  	type="number"
					  	placeholder="Enter your driver's license id"
					  	error={errors.driversLicense?.message}
					  />
          </VStack>

          <VStack spacing="4" w="45%">
            <CustomInput
					  	{...register('email', {
					  		required: 'Email is required',
					  	})}
					  	label = "Email"
					  	type="email"
					  	placeholder="Enter your email"
					  	error={errors.email?.message}
					  />
            <CustomInput
					  	{...register('phoneNo', {
					  		required: 'Phone number is required',
					  	})}
					  	label = "Phone number"
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
                }
					  	})}
					  	label = "Password"
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
					  	label = "Confirm password"
					  	type="password"
					  	placeholder="Repeat your password"
					  	error={errors.confirmPassword?.message}
					  />
          </VStack>
        </Flex>

        <Flex
          direction={'row'}
          justifyContent={'space-evenly'}
          alignItems={'center'}
          w={'full'}
          mt={5}
        >
					<SupportButton
					href="/home"
					m = "5"
					> 
					Continue as guest
					</SupportButton>
          <SupportButton
					href="/login"
					m = "5"
					> 
						Log in
					</SupportButton>
          <Spacer />
          <SubmitButton 
						label='Register'
						submittingLabel='Trying to register...'
						m = "5"
						isSubmitting={isSubmitting}
					/>
        </Flex>
      </chakra.form>
    </Box>
  );
}
