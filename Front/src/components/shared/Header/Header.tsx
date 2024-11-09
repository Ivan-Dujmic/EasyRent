import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AnimatedSignUp } from '../auth/AnimatedSignUp/AnimatedSignUp';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';

export default function Header() {
  return (
    <Box bg="white" boxShadow={'sm'} color={'black'} fontSize="sm">
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
        {/* Logo */}
        <EasyRentLogo />

        {/* Spacer and Action Buttons */}
        <Flex ml="auto" gap={4} align="center">
          <Text
            as={NextLink}
            href="/login"
            color={'black'}
            fontWeight={'semibold'}
          >
            Login
          </Text>

          {/* Small vertical line */}
          <Box height="4" borderLeft="1px" borderColor="gray" />

          <AnimatedSignUp />

          <Button
            variant="solid"
            bg={'blue'}
            color={'white'}
            fontWeight={'normal'}
            ml={5}
            fontSize="semibold"
            _hover={{
              boxShadow: 'md',
              transform: 'scale(1.025)',
            }}
          >
            Talk to us
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
