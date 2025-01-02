import { Box, Flex, Text, Link, Icon } from '@chakra-ui/react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';

export default function CompactFooter() {
  return (
    <Box as="footer" bg="brandblack" color="brandwhite" py={4} px={[4, 8, 16]}>
      <Flex
        direction={['column', 'row']}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
      >
        {/* Navigacija */}
        <Flex gap={6}>
          <Link href="/" _hover={{ color: 'brandblue' }}>
            Home
          </Link>
          <Link href="/about" _hover={{ color: 'brandblue' }}>
            About Us
          </Link>
          <Link href="/faq" _hover={{ color: 'brandblue' }}>
            FAQ
          </Link>
          <Link href="/contact" _hover={{ color: 'brandblue' }}>
            Contact Us
          </Link>
        </Flex>

        {/* Društvene mreže */}
        <Flex gap={4}>
          <Icon as={FaFacebookF} w={5} h={5} _hover={{ color: 'brandblue' }} />
          <Icon as={FaInstagram} w={5} h={5} _hover={{ color: 'brandblue' }} />
          <Icon as={FaTwitter} w={5} h={5} _hover={{ color: 'brandblue' }} />
          <Icon as={FaLinkedinIn} w={5} h={5} _hover={{ color: 'brandblue' }} />
        </Flex>

        {/* Zakonske informacije */}
        <Text fontSize="sm" textAlign="center">
          © 2025 EasyRent. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
}
