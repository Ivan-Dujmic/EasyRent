import { Vehicle } from '@/typings/vehicles/vehicles';
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
  Link,
} from '@chakra-ui/react';
import { IoPersonSharp } from 'react-icons/io5';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { TbAutomaticGearbox } from 'react-icons/tb';
import NextLink from 'next/link';
import { ICar } from '@/fetchers/homeData';

export default function VehicleCard({ vehicle }: { vehicle: ICar }) {
  return (
    <Card
      as={NextLink}
      href={`/vehicles/${vehicle.modelName}`}
      maxW="210px"
      minW="180px"
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
        src={`data:image/png;base64,${vehicle.image}`} // mozda dodat onaj neki nastavak prije
        alt={`${vehicle.modelName} car`}
        objectFit="cover"
        width="100%"
        height="110px" // Set a fixed height to make all images uniform
        borderRadius="md" // Optional: adds a nice rounded edge to the image
      />
      <CardBody px={0} py={2}>
        <Stack spacing={2} height={'100%'} justify={'space-between'}>
          <Flex direction={'column'}>
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Heading size="xs">
                {vehicle.makeName} {vehicle.modelName}
              </Heading>
              <Text fontSize="xs">€{vehicle.price}/day</Text>
            </Flex>

            {/* Kompanija koja nudi vozilo */}
            <Text color="brandgray" fontSize="xs">
              {vehicle.companyName}
            </Text>
          </Flex>
          <Flex gap={2} wrap={'wrap'} justify={'flex-start'}>
            <Flex align="flex-start">
              <IoPersonSharp />
              <Box fontSize="xs">{vehicle.noOfSeats}</Box>
            </Flex>

            <Flex align="flex-start">
              {!vehicle.automatic ? (
                <>
                  <TbManualGearboxFilled />
                  <Box fontSize="xs" ml="1">
                    M
                  </Box>
                </>
              ) : (
                <>
                  <TbAutomaticGearbox />
                  <Box fontSize="xs" ml="1">
                    A
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
              <StarIcon boxSize="3" />{' '}
              {/* Adjusts the star icon to be slightly smaller */}
              <Box>{vehicle.rating}</Box>
              <Text as="span">({vehicle.noOfReviews} reviews)</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}
