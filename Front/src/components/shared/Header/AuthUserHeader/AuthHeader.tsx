import { Box, Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import { AnimatedMyProfile } from '../../user/AnimatedMyProfile/AnimatedMyProfile';
import { useRouter } from 'next/navigation';
import { ILoginData } from '@/mutation/login';

export default function Header({ UserData }: { UserData?: ILoginData }) {
  const router = useRouter();
  const headerTextSize = useBreakpointValue({
    md: 'xs',
    lg: 'sm',
    xl: 'sm',
  });

  return (
    <Box
      bg="brandwhite"
      boxShadow="md"
      color={'brandblack'}
      fontSize="sm"
      zIndex={2}
    >
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
        {/* Logo */}
        <EasyRentLogo />

        {/* Spacer and Action Buttons */}
        <Flex ml="auto" gap={20} align="center">
          <Flex align={'center'} gap={2}>
            <Text
              as={NextLink}
              href="/myWallet"
              color={'brandblack'}
              fontWeight={'semibold'}
              fontSize={headerTextSize}
            >
              {UserData?.firstName}
            </Text>

            {/* Small vertical line */}
            <Box height="4" borderLeft="1px" borderColor="brandgray" />

            <AnimatedMyProfile />
          </Flex>

          <Button
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
            onClick={() => {
              localStorage.removeItem('userData');
              router.push('/home');
            }}
          >
            Log out
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
