'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
} from 'react-icons/fa';
import CustomMap from '@/components/shared/Map/CustomMap/CustomMap';
import FQA from '@/components/shared/info/FQA/FQA';
import ChatbotWidget from '@/components/shared/ChatbotWidget/ChatbotWidget';

export default function TalkToUs() {
  const headingSize = useBreakpointValue({
    base: '4xl', // Larger size for mobile
    sm: '4xl', // Larger heading for tablets
    md: '4xl', // Default for larger screens
  });

  const contactBoxSize = useBreakpointValue({
    base: '170px', // Square size for smaller screens
    md: '200px', // Square size for larger screens
  });

  const ferLocation = [
    {
      id: 1,
      name: 'FER - Unska 3',
      lat: 45.80072,
      lng: 15.97189,
      address: 'Unska ul. 3, 10000, Zagreb',
      workingHours: 'Mon-Fri: 9 AM - 5 PM',
      availableCars: 0,
    },
  ];

  return (
    <Flex
      direction="column"
      align="center"
      px={5}
      py={10}
      bg="brandwhite"
      color="brandblack"
      gap={5}
      width={'100vw'}
    >
      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        color="brandblue"
        pt={10}
        pb={0}
        px={5}
        width="100%"
        textAlign="center"
      >
        <Heading fontSize={headingSize} mb={2}>
          We`&apos;`re Here for{' '}
          <Text as="span" color="brandyellow">
            You
          </Text>
          !
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          maxW="600px"
          color={'brandblue'}
        >
          Whether you need assistance or have questions, feel free to reach out.
          Let`&apos;`s connect!
        </Text>
      </Flex>

      {/* Contact Options */}
      <Flex
        direction={'row'}
        justify="center"
        align="center"
        mt={10}
        width="100%"
        maxW="1200px"
        gap={5}
        wrap={'wrap'}
      >
        {[
          { icon: FaPhoneAlt, title: 'Call Us', text: '+385 95 517 1890' },
          { icon: FaEnvelope, title: 'Email Us', text: 'support@easyrent.com' },
          {
            icon: FaMapMarkerAlt,
            title: 'Visit Us',
            text: 'Unska ul. 3, 10000, Zagreb',
          },
        ].map(({ icon, title, text }, index) => (
          <Flex
            key={index}
            direction="column"
            align="center"
            justify="center"
            bg="white"
            boxShadow="lg"
            borderRadius="md"
            p={5}
            width={contactBoxSize}
            height={contactBoxSize}
          >
            <Icon as={icon} color="brandblue" boxSize={8} />
            <Heading fontSize="lg" mt={2}>
              {title}
            </Heading>
            <Text
              fontSize="sm"
              color="gray.600"
              textAlign={'center'}
              whiteSpace="normal" // Omogućava prelom teksta u novi red
              overflowWrap="break-word" // Prelomi riječ ako je preduga
            >
              {text}
            </Text>
          </Flex>
        ))}
      </Flex>

      {/* Contact Form & Map */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        mt={10}
        width="100%"
        maxW="1200px"
        gap={10}
      >
        {/* Contact Form */}
        <Flex
          direction="column"
          flex="1"
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          p={5}
          gap={5}
        >
          <Heading fontSize="xl" color={'brandblack'}>
            Send Us a Message
          </Heading>
          <Stack spacing={4}>
            <Input placeholder="Your Name" size="lg" borderColor="brandblue" />
            <Input placeholder="Your Email" size="lg" borderColor="brandblue" />
            <Input placeholder="Subject" size="lg" borderColor="brandblue" />
            <Textarea
              placeholder="Your Message"
              size="lg"
              borderColor="brandblue"
            />
          </Stack>
          <Button
            bg="brandblue"
            color="white"
            _hover={{ bg: 'brandyellow', color: 'brandblack' }}
            size="lg"
            alignSelf="flex-start"
          >
            Send Message
          </Button>
        </Flex>

        {/* Map Section */}
        <Flex flex="1" direction="column" align="center" gap={5}>
          <Heading fontSize="xl" color={'brandblue'} alignSelf="flex-start">
            Our Location
          </Heading>
          <CustomMap locations={ferLocation} showInfoWindow={true} />
        </Flex>
      </Flex>

      {/* FAQ Section */}
      <Flex direction="column" align="center" mt={10} width="100%" maxW="800px">
        <FQA />
      </Flex>

      {/* Social Links */}
      <Flex justify="center" mt={10} gap={4}>
        <Icon
          as={FaFacebookF}
          boxSize={6}
          color="brandblack"
          _hover={{ color: 'brandblue', cursor: 'pointer' }}
          onClick={() => window.open('https://facebook.com', '_blank')}
        />
        <Icon
          as={FaInstagram}
          boxSize={6}
          color="brandblack"
          _hover={{ color: 'brandblue', cursor: 'pointer' }}
          onClick={() => window.open('https://instagram.com', '_blank')}
        />
        <Icon
          as={FaTwitter}
          boxSize={6}
          color="brandblack"
          _hover={{ color: 'brandblue', cursor: 'pointer' }}
          onClick={() => window.open('https://twitter.com', '_blank')}
        />
        <Icon
          as={FaLinkedinIn}
          boxSize={6}
          color="brandblack"
          _hover={{ color: 'brandblue', cursor: 'pointer' }}
          onClick={() => window.open('https://linkedin.com', '_blank')}
        />
      </Flex>
      <ChatbotWidget />
    </Flex>
  );
}
