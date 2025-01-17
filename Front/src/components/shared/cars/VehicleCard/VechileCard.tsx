import { StarIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Box,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react';
import { IoPersonSharp } from 'react-icons/io5';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { TbAutomaticGearbox } from 'react-icons/tb';
import NextLink from 'next/link';
import { ICar } from '@/typings/vehicles/vehicles.type';

export default function VehicleCard({
  vehicle: maybeVehicle,
  key,
}: {
  vehicle: ICar | {car: ICar, rated: boolean};
  key: number;
}) {

  function isRatable(element: ICar | { car: ICar, rated: boolean }): element is { car: ICar, rated: boolean } {
    return (element as { car: ICar, rated: boolean }).car !== undefined;
  }

  let rated = !(isRatable(maybeVehicle) && !maybeVehicle.rated)
  let vehicle = isRatable(maybeVehicle) ? maybeVehicle.car : maybeVehicle

  return (
    <Card
      id={`${key}`}
      margin={0}
      as={NextLink}
      href={`/offer/:${vehicle.offer_id}`}
      maxW="260px"
      minW="260px"
      height="250px" // Fixed height for consistency
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={'brandwhite'}
      bg={'brandwhite'}
      px={2}
      _hover={{
        borderColor: 'brandblack',
        transition: 'border-color 0.3s ease',
      }}
    >
      <Image
        src={vehicle.image}
        alt={`${vehicle.modelName} car`}
        objectFit="cover"
        width="100%"
        height="160px" // Fixed height for images
        borderRadius="md"
      />
      <CardBody
        px={0}
        py={2}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {!rated && <Box
          display="flex"
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.4)"
          color="white"
          alignItems="center"
          justifyContent="center"
          opacity={1}
          transition="opacity 0.3s ease"
          _hover={{
            opacity: 0,
          }}
        >
          Leave Review
        </Box>}
        <Stack spacing={2} height={'100%'} justify={'space-between'}>
          <Flex direction={'column'}>
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Heading size="xs" noOfLines={1}>
                {vehicle.makeName} {vehicle.modelName}
              </Heading>
              <Text fontSize="xs">€{vehicle.price}/day</Text>
            </Flex>

            {/* Kompanija koja nudi vozilo */}
            <Text color="brandgray" fontSize="xs" noOfLines={1}>
              {vehicle.companyName}
            </Text>
          </Flex>
          <Flex gap={2} wrap={'wrap'} justify={'flex-start'}>
            <Flex align="flex-start">
              <IoPersonSharp />
              <Box fontSize="xs">{vehicle.noOfSeats}</Box>
            </Flex>

            <Flex align="flex-start">
              {vehicle.automatic === 'true' ? (
                <>
                  <TbAutomaticGearbox />
                  <Box fontSize="xs" ml="1">
                    A
                  </Box>
                </>
              ) : (
                <>
                  <TbManualGearboxFilled />
                  <Box fontSize="xs" ml="1">
                    M
                  </Box>
                </>
              )}
            </Flex>

            <Flex
              gap={'1px'}
              fontSize="xs"
              align="baseline"
              ml={Number(vehicle.noOfReviews) > 99 ? 0 : 'auto'}
            >
              <StarIcon boxSize="3" />
              <Box>{vehicle.rating}</Box>
              <Text as="span">({vehicle.noOfReviews} reviews)</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}
