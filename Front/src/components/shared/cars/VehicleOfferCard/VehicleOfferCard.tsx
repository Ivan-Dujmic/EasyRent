import { IOffer } from '@/fetchers/homeData';
import { StarIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, Text, Image, Stack } from '@chakra-ui/react';
import { IoPersonSharp } from 'react-icons/io5';
import { TbManualGearboxFilled, TbAutomaticGearbox } from 'react-icons/tb';

export default function VehicleOfferCard({ vehicle }: { vehicle: IOffer }) {
  console.log(vehicle);
  return (
    <Box
      maxW="800px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="#ffffff"
      p={4}
    >
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        {/* Left Section - Image */}
        <Image
          src={vehicle.image}
          alt={`${vehicle.makeName} ${vehicle.modelName}`}
          objectFit="cover"
          borderRadius="md"
          width="auto"
          maxW={'250px'}
          height="160px"
        />

        {/* Right Section - Details */}
        <Box flex="2" p={4}>
          {/* Header */}
          <Stack spacing={3}>
            <Flex alignItems="center" justifyContent="space-between" gap={2}>
              <Heading size="lg" color="gray.800">
                {vehicle.makeName} {vehicle.modelName}
              </Heading>
              {vehicle.companyLogo ? (
                <Image
                  src={vehicle.companyLogo}
                  alt={`${vehicle.companyName} Logo`}
                  borderRadius="full"
                  height={'2rem'}
                />
              ) : null}
            </Flex>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold">
              {vehicle.companyName}
            </Text>
          </Stack>

          {/* Vehicle Information */}
          <Flex wrap="wrap" align="center" gap={4} mt={4}>
            {/* Seats */}
            <Flex align="center" gap={1}>
              <IoPersonSharp />
              <Text fontSize="sm">{vehicle.noOfSeats} Seats</Text>
            </Flex>

            {/* Transmission */}
            <Flex align="center" gap={1}>
              {vehicle.automatic ? (
                <>
                  <TbAutomaticGearbox />
                  <Text fontSize="sm">A</Text>
                </>
              ) : (
                <>
                  <TbManualGearboxFilled />
                  <Text fontSize="sm">M</Text>
                </>
              )}
            </Flex>
            {/* Model Type */}
            {vehicle.modelType && (
              <Text fontSize="sm">{vehicle.modelType}</Text>
            )}

            {/* Rating */}
            <Flex align="center" gap={1}>
              <StarIcon boxSize="4" />
              <Text fontSize="sm">
                {vehicle.rating?.toFixed(2)} ({vehicle.noOfReviews} reviews)
              </Text>
            </Flex>
          </Flex>

          {/* Description */}
          <Box mt={4}>
            <Text fontSize="sm" color="gray.700">
              {vehicle.description}
            </Text>
          </Box>

          {/* Price */}
          <Box mt={4} textAlign="right">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              €{vehicle.price}/day
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
