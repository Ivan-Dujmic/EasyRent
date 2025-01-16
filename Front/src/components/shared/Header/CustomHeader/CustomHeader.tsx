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
  useDisclosure,
  Divider,
  BoxProps,
  FlexProps,
  Box,
  Flex,
  Stack,
  DrawerProps
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import { ReactElement } from 'react';
import Head from 'next/head';

interface HeaderProps extends BoxProps, FlexProps {
  HeaderItems?: ReactElement,
  MenuItems?: ReactElement
}

export const CustomHeader: React.FC<HeaderProps> = ({
  children,
  bg = 'brandwhite',
  boxShadow = 'md',
  color = 'brandblack',
  fontSize = 'sm',
  zIndex = 2,
  gap = 4,
  align = 'baseline',
  width = '100%',
  justify = 'flex-end',
  maxW = '1200px',
  mx = 'auto',
  px = 6,
  py = 4,
  HeaderItems,
  MenuItems,
  ...rest
}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg={bg}
      boxShadow={boxShadow}
      color={color}
      fontSize={fontSize}
      zIndex={zIndex}
      width={width}
    >
      <Flex
        justify={'space-between'}
        align={'center'}
        maxW={maxW}
        mx={mx}
        px={px}
        py={py}
      >
        {/* Logo */}
        <EasyRentLogo />
        <Flex gap={gap} align={align} justify={justify} {...rest}>
          
          {/* Desktop Header Items */}
          <Flex display={{ base: 'none', md: 'flex' }} align="center" gap={4}>
            {HeaderItems || children}
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

          {/* Mobile Drawer */}
          <MobileDrawer isOpen={isOpen} onClose={onClose} placement='right'>
            {MenuItems || HeaderItems || children}
          </MobileDrawer>
          
        </Flex>
      </Flex>
    </Box>
  );
};

export function MobileDrawer({
  isOpen,
  onClose,
  children = <></>,
  ...rest
}:DrawerProps) {
  return (
  <>
    <Drawer isOpen={isOpen} onClose={onClose} {...rest}>
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
              {children}
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

export default CustomHeader;