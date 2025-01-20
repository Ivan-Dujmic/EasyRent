import { Box, Button, Flex, Heading, Text, BoxProps, FlexProps } from '@chakra-ui/react';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import React from 'react';

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

// Alternatively:

// import { CustomHeader } from './Header';

// export default function Header() {
//   return <CustomHeader bg = "white" boxShadow="sm" color = "black"></CustomHeader>;
// }