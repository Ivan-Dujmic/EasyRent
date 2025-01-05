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
        {/* Povoljna cijena */}
        <Flex
          direction="column"
          align="center"
          maxW="250px"
          textAlign="center"
          _hover={{
            transform: 'scale(1.05)', // Povećanje bloka
            transition: 'transform 0.2s',
          }}
          role="group" // Omogućava grupni hover efekt
          willChange="transform"
        >
          <Icon
            as={FaDollarSign}
            w={10}
            h={10}
            color="brandyellow"
            mb={4}
            _groupHover={{ color: 'brandblue' }} // Promjena boje na hover cijelog bloka
          />
          <Heading as="h3" size="md" mb={2}>
            Affordable Prices
          </Heading>
          <Text fontSize="sm">
            Get the best rental deals with no hidden fees. Save on your next
            trip!
          </Text>
        </Flex>

        {/* Velik izbor vozila */}
        <Flex
          direction="column"
          align="center"
          maxW="250px"
          textAlign="center"
          _hover={{
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
          }}
          role="group"
          willChange="transform"
        >
          <Icon
            as={FaCar}
            w={10}
            h={10}
            color="brandyellow"
            mb={4}
            _groupHover={{ color: 'brandblue' }}
          />
          <Heading as="h3" size="md" mb={2}>
            Wide Vehicle Selection
          </Heading>
          <Text fontSize="sm">
            Choose from a variety of vehicles, from compact cars to luxury SUVs.
          </Text>
        </Flex>

        {/* Jednostavan proces rezervacije */}
        <Flex
          direction="column"
          align="center"
          maxW="250px"
          textAlign="center"
          _hover={{
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
          }}
          role="group"
          willChange="transform"
        >
          <Icon
            as={FaRegCalendarAlt}
            w={10}
            h={10}
            color="brandyellow"
            mb={4}
            _groupHover={{ color: 'brandblue' }}
          />
          <Heading as="h3" size="md" mb={2}>
            Easy Booking
          </Heading>
          <Text fontSize="sm">
            Enjoy a seamless booking process tailored to your needs.
          </Text>
        </Flex>

        {/* Korisnička podrška */}
        <Flex
          direction="column"
          align="center"
          maxW="250px"
          textAlign="center"
          _hover={{
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
          }}
          role="group"
          willChange="transform"
        >
          <Icon
            as={FaHeadset}
            w={10}
            h={10}
            color="brandyellow"
            mb={4}
            _groupHover={{ color: 'brandblue' }}
          />
          <Heading as="h3" size="md" mb={2}>
            24/7 Customer Support
          </Heading>
          <Text fontSize="sm">
            Our team is available around the clock to assist you with your
            journey.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
