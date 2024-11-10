import React from 'react';
import {Box, Button, FormControl, FormLabel, Input, Heading, VStack, Flex, Spacer
} from '@chakra-ui/react';

const LoginBox = () => {
    const suppButtons = {
        bg: "lightgray",
        p: 5,
        m: 5,
        BorderRadius: "md"
    }

    return (
      <Box
        minWidth="400px"
        maxW="800px"
        w="80vw"
        margin="0 auto"
        mt="10"
        p="6"
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Heading as="h2" size="lg" mb="6">
          Login
        </Heading>
  
        <form>
          <VStack spacing="4">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
              />
            </FormControl>
  
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
              />
            </FormControl>
  
            <Flex direction={'row'} justifyContent={'space-evenly'} alignItems={'center'}
            w={'full'}
            >
                <Button  type="submit" p={5} borderRadius="md"
                bg="blue" m="5" color={'white'}>
                Login
                </Button>
                <Spacer />
                <Button as="a" href='/register/user' sx={suppButtons}>
                Register
                </Button>
                <Button  as="a" href='/' sx={suppButtons}>
                Continue as guest
                </Button>
            </Flex>
          </VStack>
        </form>
      </Box>
    );
  };

export default function HomePage() {
  return (
    <>
    <LoginBox />
    </>
  );
}
