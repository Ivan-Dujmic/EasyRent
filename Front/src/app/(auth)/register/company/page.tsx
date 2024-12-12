'use client';

import {
  FormErrorMessage,
  chakra,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import WorkingHoursForm from '@/components/shared/auth/WorkingHoursForm';
import { IRegisterCompany } from '@/typings/company/companyRegister.type';
import useSWRMutation from 'swr/mutation';

//ovo sam ja napravio novo za company
import { registerCompany } from '@/mutation/authCompany';
//nezz dali su ovo dobri inportovi ili napravit nove fileove za company register
import { swrKeys } from '@/fetchers/swrKeys';
import SuccessWindowComapny from '@/components/shared/SuccessWidnow/SuccessWinodwCompany';
import CustomInput from '@/components/shared/auth/CustomInput';
import SupportButton from '@/components/shared/auth/SupportButton';
import SubmitButton from '@/components/shared/auth/SubmitButton';

export default function HomePage() {
  const [registered, setRegistered] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<IRegisterCompany>();

  const { trigger } = useSWRMutation(swrKeys.registerCompany, registerCompany, {
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
    // ja sam ovdje sve errore napravio unutar input componenti
    clearErrors();
    console.log('On register:', data);
    await trigger(data);
  };

  return registered ? (
    <SuccessWindowComapny />
  ) : (
    <Box
      minWidth="800px"
      maxW="1200px"
      w="80vw"
      margin="0 auto"
      mt="8"
      p="6"
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
      mb={12}
    >
      <chakra.form onSubmit={handleSubmit(onRegister)}>
        <Flex justifyContent="space-between">
          <VStack spacing="4" w="45%">
            <CustomInput
					  	{...register('name', {
					  		required: "Must enter company name",
					  	})}
					  	label = "Company name"
					  	type="text"
					  	placeholder="Enter company name"
					  	error={errors.name?.message}
					  /> 
            <CustomInput
					  	{...register('email', {
					  		required: "Email is required",
					  	})}
					  	label = "Company email"
					  	type="email"
					  	placeholder="Enter company email"
					  	error={errors.email?.message}
					  />
            <CustomInput
					  	{...register('phoneNo', {
					  		required: 'Phone number is required',
					  	})}
					  	label = "Phone number"
					  	type="tel"
					  	placeholder="Enter company phone number"
					  	error={errors.phoneNo?.message}
					  />
            <CustomInput
					  	{...register('HQaddress', {
					  		required: 'Main company address is required',
					  	})}
					  	label = "HQ address"
					  	type="text"
					  	placeholder="Enter company address"
					  	error={errors.HQaddress?.message}
					  />
            <CustomInput
					  	{...register('TIN', {
					  		required: 'TIN is required',
					  	})}
					  	label = "TIN"
					  	type="text"
					  	placeholder="Enter company TIN"
					  	error={errors.TIN?.message}
					  />
          </VStack>

          <VStack spacing="4" w="45%">
            <WorkingHoursForm />  
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
					  	placeholder="Enter password"
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
					  	placeholder="Repeat password"
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
          href='/'
          m='5'
          >
            Continue as guest
          </SupportButton>
          <SupportButton
          href='/login'
          m='5'
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
