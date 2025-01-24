'use client';

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { IoPersonSharp } from 'react-icons/io5';
import { TbManualGearboxFilled, TbAutomaticGearbox } from 'react-icons/tb';
import NextLink from 'next/link';
import { ICar, IReviewable } from '@/typings/vehicles/vehicles.type';
import ReviewForm from '../../review/ReviewForm';
import GrayFilter from '../../filter/overlay/GrayFilter';

/**
 * Optional helper to format ISO strings into "DD.MM.YYYY HH:MM" or whichever format you prefer.
 */
function formatDateTime(isoString?: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${mins}`;
}

interface VehicleCardProps {
  vehicle: ICar;
  /**
   * If true, clicking a non-reviewable card (with rentalFrom/rentalTo)
   * will open a "Rental Details" modal instead of going to /offer/[offer_id].
   */
  showRentalDetailsOnClick?: boolean;
  /**
   * Not typically used in functional components,
   * but if you pass a 'key' prop from the list, we can accept it here.
   */
  key?: number;
}

export default function VehicleCard({
  vehicle: maybeVehicle,
  showRentalDetailsOnClick = false,
}: VehicleCardProps) {
  const {
    onOpen: onOpenReview,
    isOpen: isOpenReview,
    onClose: onCloseReview,
  } = useDisclosure();

  // For the rental details modal
  const {
    onOpen: onOpenRentalModal,
    isOpen: isOpenRentalModal,
    onClose: onCloseRentalModal,
  } = useDisclosure();

  // Cast to IReviewable so we can check .rated
  const vehicle = maybeVehicle as IReviewable;
  const isReviewable = vehicle.rated !== undefined && !vehicle.rated;

  /**
   * Decide whether the card will be wrapped by a NextLink to /offer/[offer_id]
   * or, if 'showRentalDetailsOnClick' is true (and we have rental data),
   * it will open a modal on click. If it's reviewable, the "Leave Review"
   * overlay/behavior takes top priority.
   */
  const canShowRentalModal =
    showRentalDetailsOnClick &&
    vehicle.rentalFrom &&
    vehicle.rentalTo &&
    !isReviewable;

  // We'll handle onClick manually. If it's reviewable, we open the review modal.
  // Else if we want to show rental details, open rental modal.
  // Otherwise, do nothing. The link to /offer is handled by wrapping the card in NextLink.
  const handleCardClick = () => {
    if (isReviewable) {
      onOpenReview();
    } else if (canShowRentalModal) {
      onOpenRentalModal();
    }
    // else do nothing (the card is wrapped in NextLink anyway)
  };

  // We conditionally wrap the card in a link if it's *not* reviewable
  // and *not* set to open the rental modal.
  const cardWrapper = (children: React.ReactNode) => {
    const shouldWrapInLink = !isReviewable && !canShowRentalModal;

    if (shouldWrapInLink) {
      return (
        <NextLink href={`/offer/${vehicle.offer_id}`} passHref>
          {children}
        </NextLink>
      );
    }
    return <>{children}</>;
  };

  return (
    <>
      {cardWrapper(
        <Card
          margin={0}
          maxW="260px"
          minW="260px"
          height="250px"
          borderWidth="2px"
          borderRadius="lg"
          overflow="hidden"
          borderColor="#ffffff"
          bg="#ffffff"
          px={2}
          cursor="pointer"
          _hover={{
            borderColor: 'brandblack',
            transition: 'border-color 0.3s ease',
          }}
          onClick={handleCardClick}
          position="relative"
        >
          {/* Vehicle Image */}
          <Image
            src={vehicle.image}
            alt={`${vehicle.modelName} car`}
            objectFit="cover"
            width="100%"
            height="160px"
            borderRadius="md"
          />

          {/* Gray "Leave Review" overlay if isReviewable */}
          <GrayFilter
            onClick={(e) => {
              e.stopPropagation();
              onOpenReview();
            }}
            show={isReviewable}
            _hover={{
              opacity: 0.8,
            }}
          >
            Leave Review
          </GrayFilter>

          {/* Card Body with details */}
          <CardBody
            px={0}
            py={2}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Stack spacing={2} height="100%" justify="space-between" px={2}>
              <Flex direction="column">
                <Flex gap={1} align="baseline" justify="space-between">
                  <Heading size="xs" noOfLines={1}>
                    {vehicle.makeName} {vehicle.modelName}
                  </Heading>
                  <Text fontSize="xs">€{vehicle.price}/day</Text>
                </Flex>

                <Text color="brandgray" fontSize="xs" noOfLines={1}>
                  {vehicle.companyName}
                </Text>
              </Flex>

              <Flex gap={2} wrap="wrap" justify="flex-start">
                {/* Seats */}
                <Flex align="flex-start">
                  <IoPersonSharp />
                  <Box fontSize="xs">{vehicle.noOfSeats}</Box>
                </Flex>
                {/* Transmission */}
                <Flex align="flex-start">
                  {vehicle.automatic ? (
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
                {/* Rating */}
                <Flex gap="1px" fontSize="xs" align="baseline">
                  <StarIcon boxSize="3" />
                  <Box>{vehicle.rating?.toFixed(2)}</Box>
                  <Text as="span">({vehicle.noOfReviews} reviews)</Text>
                </Flex>
              </Flex>
            </Stack>
          </CardBody>
        </Card>
      )}

      {/* Review Modal */}
      <ReviewForm
        isOpen={isOpenReview}
        onClose={onCloseReview}
        vehicle={vehicle}
      />

      {/* Rental Details Modal */}
      <Modal isOpen={isOpenRentalModal} onClose={onCloseRentalModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rental Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <strong>Pick-up:</strong> {formatDateTime(vehicle.rentalFrom)}
            </Text>
            <Text mt={2}>
              <strong>Drop-off:</strong> {formatDateTime(vehicle.rentalTo)}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onCloseRentalModal}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
