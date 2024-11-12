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

type FormFields = {
  email: string;
  password: string;
};

export default function HomePage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    await new Promise((resolve) => {
      try {
        // tu saljem pudatke backendu
        setTimeout(resolve, 1000);
      } catch (error) {
        // tu hvatam error-e okje mi backend posalje
        setError('root', {
          message: 'This email is not registered.',
        });
      }
    });
  };

  const suppButtons = {
    bg: 'lightgray',
    p: 5,
    m: 5,
    BorderRadius: 'md',
  };

  return (
    <Box
      minWidth="400px"
      maxW="800px"
      w="80vw"
      margin="auto auto"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      bg="white"
    >
      <Heading as="h2" size="lg" mb="6">
        Login
      </Heading>

      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              {...register('email', {
                required: 'Email is required',
                validate: (value: string) => {
                  value.includes('@');
                  return 'Email must include @';
                },
              })}
              type="email"
              name="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <FormErrorMessage color={'red'}>
                {errors.email.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              {...register('email')}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </FormControl>

          <Flex
            direction={'row'}
            justifyContent={'space-evenly'}
            alignItems={'center'}
            w={'full'}
          >
            <Button
              type="submit"
              p={5}
              borderRadius="md"
              bg="blue"
              m="5"
              color={'white'}
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
