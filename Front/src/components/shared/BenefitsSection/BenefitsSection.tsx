import { Box, Flex, Heading, Text, Icon } from '@chakra-ui/react';
import {
  FaDollarSign,
  FaCar,
  FaRegCalendarAlt,
  FaHeadset,
} from 'react-icons/fa';

export default function BenefitsSection() {
  return (
    <Flex direction={'column'} bg="brandwhite" py={12} px={5} gap={5}>
      {/* Naslov sekcije */}
      <Heading as="h2" size="lg" textAlign="center" mb={8}>
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
        gap={8}
        wrap="wrap"
      >
        {/* Povoljna cijena */}
        <Flex direction="column" align="center" maxW="250px" textAlign="center">
          <Icon as={FaDollarSign} w={10} h={10} color="brandyellow" mb={4} />
          <Heading as="h3" size="md" mb={2}>
            Affordable Prices
          </Heading>
          <Text fontSize="sm">
            Get the best rental deals with no hidden fees. Save on your next
            trip!
          </Text>
        </Flex>

        {/* Velik izbor vozila */}
        <Flex direction="column" align="center" maxW="250px" textAlign="center">
          <Icon as={FaCar} w={10} h={10} color="brandyellow" mb={4} />
          <Heading as="h3" size="md" mb={2}>
            Wide Vehicle Selection
          </Heading>
          <Text fontSize="sm">
            Choose from a variety of vehicles, from compact cars to luxury SUVs.
          </Text>
        </Flex>

        {/* Jednostavan proces rezervacije */}
        <Flex direction="column" align="center" maxW="250px" textAlign="center">
          <Icon
            as={FaRegCalendarAlt}
            w={10}
            h={10}
            color="brandyellow"
            mb={4}
          />
          <Heading as="h3" size="md" mb={2}>
            Easy Booking
          </Heading>
          <Text fontSize="sm">
            Enjoy a seamless booking process tailored to your needs.
          </Text>
        </Flex>

        {/* Korisnička podrška */}
        <Flex direction="column" align="center" maxW="250px" textAlign="center">
          <Icon as={FaHeadset} w={10} h={10} color="brandyellow" mb={4} />
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
