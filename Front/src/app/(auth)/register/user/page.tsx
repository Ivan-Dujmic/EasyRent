'use client';

import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { swrKeys } from '@/fetchers/swrKeys';
import { registerUser } from '@/mutation/auth';
import { IRegisterUser } from '@/typings/users/user.type';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Flex,
  Spacer,
  chakra,
  FormErrorMessage,
  Center,
  Heading,
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

  const suppButtons = {
    bg: "brandlightgray",
    p: 5,
    m: 5,
    BorderRadius: 'md',
  };

  const inputText = {
    w: '40%',
  };

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
    console.log(data);
  };

  return registered ? (
    <SuccessWindow />
  ) : (
    <Box
      minWidth="800px"
      maxW="1200px"
      w="80vw"
      margin="0 auto"
      mt="10"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      bg="brandwhite"
    >
      <chakra.form onSubmit={handleSubmit(onRegister)}>
        <Flex justifyContent="space-between">
          <VStack spacing="4" w="45%">
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your first name"
                {...register('firstName')}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your last name"
                {...register('lastName')}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Driver's Licence</FormLabel>
              <Input
                type="number"
                placeholder="Enter your driver's licence id"
                {...register('driverLicence')}
              />
            </FormControl>
          </VStack>

          <VStack spacing="4" w="45%">
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                required
                {...register('email')}
              />
              {errors.email && (
                <FormErrorMessage color="brandblue">
                  {errors.email?.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone number</FormLabel>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                {...register('phoneNumber')}
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              {errors.password && (
                <FormErrorMessage color="brandblue">
                  {errors.password?.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm password</FormLabel>
              <Input
                type="password"
                placeholder="Repeat your password"
                {...register('confirmPassword', {
                  required: 'Password confirmation is required',
                  validate: (value) =>
                    value === getValues('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <FormErrorMessage color="brandblue">
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        </Flex>

        <Flex
          direction={'row'}
          justifyContent={'space-evenly'}
          alignItems={'center'}
          w={'full'}
          mt={5}
        >
          <Button as="a" href="/home" sx={suppButtons}>
            Continue as guest
          </Button>
          <Button
            as="a"
            href="/login"
            p={5}
            borderRadius="md"
            sx={suppButtons}
            bg="brandblue"
            m="5"
          >
            Login
          </Button>
          <Spacer />
          <Button
            type="submit"
            p={5}
            borderRadius="md"
            bg="brandblue"
            m="5"
            color={'brandwhite'}
            mr="30%"
          >
            Register
          </Button>
        </Flex>
      </chakra.form>
    </Box>
  );
}
