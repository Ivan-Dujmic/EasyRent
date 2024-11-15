import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, Button, Heading, Icon, Text, VStack } from '@chakra-ui/react';

export default function SuccessWindowComapny() {
  return (
    <Box
      bg="brandGray"
      w="100%"
      maxW="600px"
      margin="0 auto"
      mt={10}
      p={6}
      borderRadius="md"
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Icon as={CheckCircleIcon} w={10} h={10} color="brandyellow" />
        <Heading as="h2" color="brandBlue" fontSize="2xl">
          Application Received! 🎉
        </Heading>
        <Text fontSize="lg" color="brandblack">
          Thank you for applying. Please check your email to verify your
          account. After verifying your email, an administrator will review your
          application and approve your account. Once approved, you’ll be able to
          log in and start exploring.
        </Text>
        <Button
          bg={'brandblue'}
          color={'brandwhite'}
          fontWeight={'normal'}
          fontSize="md"
          size="md"
          _hover={{
            bg: 'brandblue',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
          as="a"
          href="/login"
        >
          Jump to login
        </Button>
      </VStack>
    </Box>
  );
}
