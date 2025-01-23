import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import SupportButton from '../auth/SupportButton';
import { usePathname } from 'next/navigation';
import LogOutButton from '../auth/LogOutButton/LogOutButton';

export default function CompanyProfileHeader() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  const companyName = parts[1];
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
          <Flex justifyContent="space-evenly" w="30%" alignItems="center">
          <Button
              as="a"
              bg={'brandmiddlegray'}
              color={'brandblack'}
              fontWeight={'semibold'}
              fontSize="md"
              size="md"
              borderWidth="2px"
              borderColor="brandwhite"
              _hover={{
                borderColor: 'brandblack',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease, box-shadow 0.3s ease',
              }}
              href={`/profile/${companyName}/info`}
            >
              Profile
            </Button>
            <LogOutButton useAlt = {false}/>
          </Flex>
      </Flex>
    </Box>
  );
}
