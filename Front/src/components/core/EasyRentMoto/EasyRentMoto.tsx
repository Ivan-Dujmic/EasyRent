import { Heading, Text, Box } from '@chakra-ui/react';

export default function EasyRentMoto() {
  return (
    <Box textAlign={{ base: 'center', md: 'left' }} px={{ base: 4, md: 0 }}>
      <Heading
        fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
        lineHeight={{ base: 'shorter', md: 'short' }}
        fontWeight="bold"
      >
        Your{' '}
        <Text as="span" color="brandyellow">
          Key
        </Text>{' '}
        to Effortless Car Rentals
      </Heading>
    </Box>
  );
}
