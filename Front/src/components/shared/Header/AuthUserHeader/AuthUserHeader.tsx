'use client';

import {
  Box,
  Flex,
  Text,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  Divider,
  Stack,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import { AnimatedMyProfile } from '../../user/AnimatedMyProfile/AnimatedMyProfile';
import LogOutButton from '../../auth/LogOutButton/LogOutButton';
import { IUser } from '@/typings/users/user.type';

export default function AuthUserHeader({ UserData }: { UserData?: IUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log(UserData);

  return (
    <Box
      bg="brandwhite"
      boxShadow="md"
      color={'brandblack'}
      fontSize="sm"
      zIndex={2}
      width={'100%'}
    >
      {/* Desktop Header */}
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
        {/* Logo */}
        <EasyRentLogo />

        {/* Spacer and Action Buttons */}
        <Flex
          ml="auto"
          display={{ base: 'none', md: 'flex' }}
          gap={6}
          align="center"
        >
          {/* User Profile Info */}
          <Flex align="center" gap={4}>
            <Text
              as={NextLink}
              href="/myProfile"
              color={'brandblack'}
              fontWeight={'semibold'}
            >
              {UserData?.firstName || 'Guest'} {UserData?.lastName || ''}
            </Text>
            <Box height="4" borderLeft="1px" borderColor="brandgray" />
            <AnimatedMyProfile />
          </Flex>

          {/* Account Balance */}
          {UserData?.balance !== undefined && (
            <Text fontWeight="semibold" color="brandblue">
              Balance: €{Number(UserData.balance).toFixed(2)}
            </Text>
          )}

          {/* Log Out Button */}
          <LogOutButton />
        </Flex>

        {/* Hamburger menu for mobile */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onOpen}
          color="brandblue"
          size="lg"
          ml="auto"
        />
      </Flex>

      {/* Drawer for mobile menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Flex justify="space-between" align="center">
              <EasyRentLogo />
              <IconButton
                aria-label="Close menu"
                icon={<CloseIcon />}
                variant="ghost"
                onClick={onClose}
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <VStack align="flex-start" spacing={4}>
              {/* Profile Information */}
              <AnimatedMyProfile color="brandblack" />

              {/* Account Balance */}
              {UserData?.balance !== undefined && (
                <Text fontWeight="semibold" color="brandblue">
                  Balance: €{Number(UserData.balance).toFixed(2)}
                </Text>
              )}

              {/* Log Out */}
              <LogOutButton />

              <Divider />

              {/* Additional Information */}
              <Stack spacing={3} pt={2}>
                <Text fontWeight="bold" color="brandblue">
                  Need Help?
                </Text>
                <Text fontSize="sm" color="brandblack">
                  Contact us at{' '}
                  <Text as="span" fontWeight="bold">
                    support@easyrent.com
                  </Text>{' '}
                  or call us at{' '}
                  <Text as="span" fontWeight="bold">
                    +385 95 517 1890
                  </Text>
                  .
                </Text>
                <Text fontSize="sm" color="brandblack">
                  Enjoy seamless car rentals at the best prices.
                </Text>
              </Stack>

              {/* Talk To us */}
              <Button
                as={NextLink}
                bg={'brandblue'}
                color={'brandwhite'}
                fontWeight={'normal'}
                fontSize="md"
                _hover={{
                  bg: 'brandyellow',
                  color: 'brandblack',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onClick={onClose}
                href="/TalkToUs"
              >
                Talk to us
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
