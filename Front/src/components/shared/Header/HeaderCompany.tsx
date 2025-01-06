import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';

export default function CompanyProfileHeader() {
  return (
    <Box
      bg="brandwhite"
      boxShadow="md"
      color={'brandblack'}
      fontSize="sm"
      zIndex={2}
      w="100%"
    >
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4} justifyContent="space-between">
        {/* Logo */}
        <EasyRentLogo />

        <Button
            as="a"
            bg={'brandmiddlegray'}
            color={'brandblack'}
            fontWeight={'semibold'}
            fontSize="sm"
            size="sm"
            borderWidth="2px"
            borderColor="brandwhite"
            _hover={{
              borderColor: 'brandblack',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease',
            }}
            href='/home'
          >
            Log out
          </Button>
      </Flex>
    </Box>
  );
}
