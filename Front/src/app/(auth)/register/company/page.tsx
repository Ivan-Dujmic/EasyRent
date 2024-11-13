'use client';

import {FormErrorMessage, chakra, Box, Button, FormControl, FormLabel, Input, VStack, Flex, Spacer, Container} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
import WorkingHoursForm from '@/components/shared/auth/WorkingHoursForm';
import { IRegisterCompany } from '@/typings/CompanyTyping/CompanyTyping';


export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    getValues,
  } = useForm<IRegisterCompany>();

  const onRegister = async (data: IRegisterCompany) => {
  
    console.log(data);
    }

  const suppButtons = {
    bg: "brandlightgray",
    p: 5,
    m: 5,
    BorderRadius: 'md',
  };

  const inputText = {
    w: "40%"
  }

  return (
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
              <FormLabel>Company name</FormLabel>
              <Input
              {...register("name")}
                type="text"
                placeholder="Enter company name"
              />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Company email</FormLabel>
            <Input
            {...register("email")}
              type="email"
              placeholder="Enter company email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone number</FormLabel>
            <Input
            {...register("phone")}
              type="tel"
              placeholder="Enter company phone number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>HQ address</FormLabel>
            <Input
            {...register("HQaddress")}
              type="text"
              placeholder="Enter company address"
            />
          </FormControl>
        </VStack>
      
        <VStack spacing="4" w="45%">
          <WorkingHoursForm />
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
            {...register("password")}
              type="password"
              placeholder="Enter your password"
            />
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password_confirm}>
            <FormLabel>Confirm password</FormLabel>
            <Input
            {...register("password_confirm", {
              required: true,
              validate: (value: string) =>{
                if (value === getValues('password'))
                  return true;
                return 'Passwords do not match';
              }})
            }
              type="password"
              placeholder="Repeat your password"
            />
          {errors.password_confirm && (<FormErrorMessage color="red">{errors.password_confirm.message}</FormErrorMessage>)}
          </FormControl>
        </VStack>
      </Flex>

      <Flex direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}
        w={'full'} mt={5}
        >
          <Button  as="a" href='/' sx={suppButtons}>
            Continue as guest
          </Button>
          <Button as="a" href='/login' p={5} borderRadius="md" sx={suppButtons}
          bg="brandblue" m="5">
            Login
          </Button>
            <Spacer />
          <Button type="submit" p={5} borderRadius="md"
          bg="brandblue" m="5" color={'brandwhite'} mr="30%">
            Register
          </Button>
        </Flex>
    </chakra.form>
  </Box>
  );
}

