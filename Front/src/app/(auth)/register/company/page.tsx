import {Box, Button, FormControl, FormLabel, Input, Heading, VStack, Flex, Spacer} from '@chakra-ui/react';
import WorkingHoursForm from '@/components/shared/auth/WorkingHoursForm';

export default function HomePage() {
  const suppButtons = {
    bg: "lightgray",
    p: 5,
    m: 5,
    BorderRadius: "md"
}

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
        bg="white"
      >
  
        <form>
          <Flex justifyContent="space-between">
            <VStack spacing="4" w="45%">
              <FormControl isRequired>
                  <FormLabel>Company name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter company name"
                  />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Company email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter company email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone number</FormLabel>
                <Input
                  type="tel"
                  name="tel"
                  placeholder="Enter company phone number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>HQ address</FormLabel>
                <Input
                  type="text"
                  name="address"
                  placeholder="Enter company address"
                />
              </FormControl>
            </VStack>
          
            <VStack spacing="4" w="45%">
              <WorkingHoursForm />
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  placeholder="Repeat your password"
                />
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
              bg="blue" m="5">
                Login
              </Button>
                <Spacer />
              <Button type="submit" p={5} borderRadius="md"
              bg="blue" m="5" color={'white'} mr="30%">
                Register
              </Button>
            </Flex>
        </form>
      </Box>
  );
}
