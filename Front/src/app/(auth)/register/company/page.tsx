import {Box, Button, FormControl, FormLabel, Input, Heading, VStack, Flex, Spacer} from '@chakra-ui/react';


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
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Enter your first name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                name="surname"
                placeholder="Enter your last name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Driver's Licence</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your driver's licence id"
              />
            </FormControl>
            </VStack>
          
            <VStack spacing="4" w="45%">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone number</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your phone number"
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
