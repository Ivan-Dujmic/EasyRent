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
  useDisclosure,
} from '@chakra-ui/react';
import { IoPersonSharp } from 'react-icons/io5';
import { TbManualGearboxFilled, TbAutomaticGearbox } from 'react-icons/tb';
import NextLink from 'next/link';
import { IReviewable } from '@/typings/vehicles/vehicles.type';
import ReviewForm from '../../review/ReviewForm';
import { useRouter } from 'next/navigation';
import GrayFilter from '../../filter/overlay/GrayFilter';
import { ICar } from '@/fetchers/homeData';

interface VehicleCardProps {
  vehicle: ICar;
  key: number;
}

export default function VehicleCard({
  vehicle: maybeVehicle,
}: VehicleCardProps) {
  const {
    onOpen: onOpenReview,
    isOpen: isOpenREview,
    onClose: onCloseReview,
  } = useDisclosure();

  let vehicle = maybeVehicle as IReviewable;
  let isReviewable = vehicle.rated !== undefined;
  let isReviewed = !isReviewable || vehicle.rated;

  return (
    <Card
      margin={0}
      as={NextLink}
      href={!isReviewable ? `/offer/${vehicle.offer_id}` : {}}
      maxW="260px"
      minW="260px"
      height="250px" // Fixed height for consistency
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={'#ffffff'} // {"#brandwhite"}
      bg={'#ffffff'} // {"#brandwhite"}
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
        <GrayFilter
          onClick={onOpenReview}
          show={!isReviewed}
          _hover={{
            opacity: 0,
          }}
        >
          Leave Review
        </GrayFilter>
        <ReviewForm
          isOpen={isOpenREview}
          onClose={onCloseReview}
          vehicle={vehicle as ICar}
        />
        <Stack spacing={2} height={'100%'} justify={'space-between'}>
          <Flex direction={'column'}>
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Heading size="xs" noOfLines={1}>
                {vehicle.makeName} {vehicle.modelName}
              </Heading>
              <Text fontSize="xs">€{vehicle.price}/day</Text>
            </Flex>

            {/* Company offering the vehicle */}
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
              {vehicle.automatic === true ? (
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
              <Box>{vehicle.rating?.toFixed(2)}</Box>
              <Text as="span">({vehicle.noOfReviews} reviews)</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}
