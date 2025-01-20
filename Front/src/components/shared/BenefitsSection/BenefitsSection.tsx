import {
  Flex,
  Heading,
  Text,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaDollarSign,
  FaCar,
  FaRegCalendarAlt,
  FaHeadset,
} from 'react-icons/fa';

export default function BenefitsSection() {
  const headingSize = useBreakpointValue({
    base: '2xl', // Default heading size for laptop/tablet
    sm: '3xl', // Larger heading for desktop
    md: '4xl',
  });

  return (
    <Flex direction={'column'} bg="brandwhite" py={5} px={5} gap={6}>
      {/* Naslov sekcije */}
      <Heading as="h2" fontSize={headingSize} textAlign="center" mb={8}>
        Why Choose{' '}
        <Text as={'span'} color={'brandblue'}>
          EasyRent
        </Text>
        ?
      </Heading>

      {/* Glavne prednosti */}
      <Flex
        direction={['column', 'column', 'row']}
        justify="space-around"
        align="center"
        gap={[6, 8, 10]} // Razmak prilagođen za manje ekrane
        wrap="wrap"
      >
        {[
          {
            icon: FaDollarSign,
            title: 'Affordable Prices',
            text: 'Get the best rental deals with no hidden fees. Save on your next trip!',
          },
          {
            icon: FaCar,
            title: 'Wide Vehicle Selection',
            text: 'Choose from a variety of vehicles, from compact cars to luxury SUVs.',
          },
          {
            icon: FaRegCalendarAlt,
            title: 'Easy Booking',
            text: 'Enjoy a seamless booking process tailored to your needs.',
          },
          {
            icon: FaHeadset,
            title: '24/7 Customer Support',
            text: 'Our team is available around the clock to assist you with your journey.',
          },
        ].map((benefit, index) => (
          <Flex
            key={index}
            direction="column"
            align="center"
            maxW="250px"
            textAlign="center"
            _hover={{
              transform: 'scale(1.05)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
            }}
            role="group"
            willChange="transform"
          >
            <Icon
              as={benefit.icon}
              w={10}
              h={10}
              color="brandyellow"
              mb={4}
              _groupHover={{ color: 'brandblue' }}
            />
            <Heading as="h3" size="md" mb={2}>
              {benefit.title}
            </Heading>
            <Text fontSize="sm">{benefit.text}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
