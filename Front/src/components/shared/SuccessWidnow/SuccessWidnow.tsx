import { CheckCircleIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

interface ISuccessWindow {
  link: string;
  description: string;
  buttonText: string;
}

export default function SuccessWindow() {
  return (
    <Box
      bg="brandGray"
      w="100%"
      maxW="600px"
      margin="0 auto"
      mt={10}
      p={6}
      borderRadius="md"
      boxShadow="lg"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Icon as={CheckCircleIcon} w={10} h={10} color="brandYellow" />
        <Heading as="h2" color="brandBlue" fontSize="2xl">
          Application Received! 🎉
        </Heading>
        <Text fontSize="lg" color="brandBlue">
          Thank you for applying. Please check your email to verify your
          account. Once your account is verified, you’ll be able to log in and
          start exploring.
        </Text>
      </VStack>
    </Box>
  );
}
