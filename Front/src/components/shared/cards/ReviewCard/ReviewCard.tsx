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
  CardHeader,
  Divider,
  VStack,
  HStack,
  Badge,
  CardFooter,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { IReview } from '@/fetchers/homeData';

export default function ReviewCard({ review }: { review: IReview }) {
  return (
    <Card
      maxW="350px"
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
      <CardHeader>
        <Heading size="md">
          {review.modelName} - {review.registration}
        </Heading>
      </CardHeader>
      <Divider />
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack>
            <Text fontSize="sm" color="gray.600">
              Reviewed by:
            </Text>
            <Badge colorScheme="blue">{review.customerName} {review.customerSurname}</Badge>
          </HStack>
          <HStack>
            <Text fontSize="sm" color="gray.600">
              Rating:
            </Text>
            <Text fontSize="sm" color="gray.600">
              {review.rating}
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Date: {new Date(review.date).toLocaleDateString()}
          </Text>
        </VStack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Text fontSize="md" color="gray.800">
          "{review.description}"
        </Text>
      </CardFooter>
    </Card>
  );
}
