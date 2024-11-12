import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';

export default function Header() {
  return (
    <Box bg="white" boxShadow={'sm'} color={'black'} fontSize="sm">
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
        {/* Logo */}
        <EasyRentLogo />
      </Flex>
    </Box>
  );
}
