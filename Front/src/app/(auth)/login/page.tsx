'use client';

import {
  chakra,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Flex,
  Spacer,
  FormErrorMessage,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { ILogIn } from '@/typings/logIn/logIn.type';

import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { logIn } from '@/mutation/login';



export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    getValues,
  } = useForm<ILogIn>();

  const { trigger } = useSWRMutation(swrKeys.logIn, logIn, {
    onSuccess: () => {
      setLoggedIn(true);
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
    console.log('On register:', data);
    await trigger(data);
    console.log(data);
  };

  const suppButtons = {
          bg: "brandlightgray",
          p: 5,
          m: 5,
          BorderRadius: "md"
  }

  return loggedIn ? (
    <SuccessWindow />
  ) : (
    <Box
      minWidth="400px"
      maxW="800px"
      w="80vw"
      margin="0 auto"
      mt="10"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      bg="brandwhite"
    >
      <Heading as="h2" size="lg" mb="6">
        Login
      </Heading>

      <chakra.form onSubmit={handleSubmit(onLogIn)}>
        <VStack spacing="4">
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email", {
                required: "Email is required",
                validate: (value: string) => {
                  value.includes("@");
                  return "Email must include @";
                }
              })}
              type="email"
              name="email"
              placeholder="Enter your email"
            />
          {errors.email && <FormErrorMessage color={"red"}>{errors.email.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              {...register("email", {
                required: "Must enter password"
              })}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          {errors.password && <FormErrorMessage color={"red"}>{errors.password.message}</FormErrorMessage>}
          </FormControl>
          <Flex direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}
            w={'full'}
          >
            <Button
              type="submit"
              p={5}
              borderRadius="md"
              bg="brandblue"
              m="5"
              color={'brandwhite'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          <Spacer />
          <Button as="a" href="/register/user" sx={suppButtons}>
            Register
          </Button>
          <Button as="a" href="/home" sx={suppButtons}>
            Continue as guest
          </Button>
        </Flex>
        </VStack>
      </chakra.form>
    </Box>
  );
}
