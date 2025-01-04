import { FooterLinks } from '@/typings/footerInterfaces/FooterInterfaces';
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  Link,
  Divider,
} from '@chakra-ui/react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcStripe,
} from 'react-icons/fa';

interface FooterProps {
  links: FooterLinks;
}

export default function Footer({ links }: FooterProps) {
  return (
    <Box
      as="footer"
      bg="brandblack"
      color="brandwhite"
      py={10}
      px={[4, 8, 16]}
      mt={10}
      width={'100vw'}
    >
      {/* Gornji dio */}
      <Flex
        direction={['column', 'row']}
        justify="space-between"
        align="flex-start"
        wrap="wrap"
        mb={10}
        gap={[8, 8, 0]}
      >
        {/* Navigacija */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Quick Links
          </Heading>
          <Flex direction="column" gap={2}>
            {links.quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                _hover={{ color: 'brandblue', textDecoration: 'underline' }}
              >
                {link.label}
              </Link>
            ))}
          </Flex>
        </Box>

        {/* Kontakt informacije */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Contact Us
          </Heading>
          <Text mb={1} fontSize={'sm'}>
            Phone: {links.contactInfo.phone}
          </Text>
          <Text mb={1} fontSize={'sm'}>
            Email: {links.contactInfo.email}
          </Text>
          <Text fontSize={'sm'}>Address: {links.contactInfo.address}</Text>
        </Box>

        {/* Društvene mreže */}
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Follow Us
          </Heading>
          <Flex gap={4}>
            {links.socialLinks.map((socialLink) => (
              <Link
                key={socialLink.label}
                href={socialLink.href}
                isExternal
                _hover={{ color: 'brandblue', transform: 'scale(1.2)' }}
              >
                {socialLink.icon && <Icon as={socialLink.icon} w={6} h={6} />}
              </Link>
            ))}
          </Flex>
        </Box>
      </Flex>

      <Divider borderColor="brandwhite" mb={10} />

      {/* Donji dio */}
      <Flex
        direction={['column', 'row']}
        justify="space-between"
        align="center"
        gap={[4, 0]}
      >
        <Text fontSize="sm" textAlign={['center', 'left']}>
          © 2025 EasyRent. All rights reserved.
        </Text>
        <Flex gap={4}>
          {links.paymentIcons?.map((IconComponent, index) => (
            <Icon key={index} as={IconComponent} w={6} h={6} />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
