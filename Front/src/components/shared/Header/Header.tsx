import {
  Box,
  Button,
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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';
import { AnimatedSignUp } from '../auth/AnimatedSignUp/AnimatedSignUp';

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg="brandwhite"
      boxShadow="md"
      color={'brandblack'}
      fontSize="sm"
      zIndex={2}
      width={'100%'}
    >
      <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
        {/* Logo */}
        <EasyRentLogo />

        {/* Spacer and Action Buttons */}
        <Flex
          ml="auto"
          display={{ base: 'none', md: 'flex' }}
          gap={4}
          align="center"
        >
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
          >
            Talk to us
          </Button>
        </Flex>

        {/* Hamburger menu for mobile */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={onOpen}
          color="brandblue" // Ensures the icon is brandblue
          _hover={{
            color: 'brandblue', // Keeps hover state the same color
            backgroundColor: 'transparent', // No background on hover
          }}
          _active={{
            backgroundColor: 'transparent', // No background when active
          }}
          _focus={{
            boxShadow: 'none', // Removes any focus outline
          }}
          size="lg" // Adjusts size for better visibility
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
              <Text
                as={NextLink}
                href="/login"
                fontWeight="semibold"
                onClick={onClose} // Close drawer on link click
              >
                Login
              </Text>

              <AnimatedSignUp />

              <Button
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
              >
                Talk to us
              </Button>

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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
