'use client';

import {
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
  Box,
  Flex,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { AnimatedSignUp } from '../auth/AnimatedSignUp/AnimatedSignUp';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import CustomHeader from './CustomHeader/CustomHeader';

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CustomHeader>
        {/* Desktop Menu */}
        <Flex display={{ base: 'none', md: 'flex' }} align="center" gap={4}>
          <Text
            as={NextLink}
            href="/login"
            color={'brandblack'}
            fontWeight={'semibold'}
          >
            Login
          </Text>

          {/* Small vertical line */}
          <Box height="4" borderLeft="1px" borderColor="brandgray" />

          <AnimatedSignUp />

          <Button
            as={NextLink}
            bg={'brandblue'}
            color={'brandwhite'}
            fontWeight={'normal'}
            fontSize="sm"
            size="sm"
            _hover={{
              bg: 'brandblue',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease',
            }}
            href="/TalkToUs"
          >
            Talk to us
          </Button>
        </Flex>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onOpen}
          color="brandblue"
          size="lg"
        />
      </CustomHeader>

      {/* Mobile Drawer */}
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
              <Text
                as={NextLink}
                href="/login"
                fontWeight="semibold"
                onClick={onClose}
              >
                Login
              </Text>
              <AnimatedSignUp />
              <Button
                as={NextLink}
                bg={'brandblue'}
                color={'brandwhite'}
                fontWeight={'normal'}
                fontSize="md"
                _hover={{
                  bg: 'brandblue',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onClick={onClose}
                href="/TalkToUs"
              >
                Talk to us
              </Button>
              <Divider />
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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
