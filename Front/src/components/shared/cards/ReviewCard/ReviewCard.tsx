"use client";

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
      maxW="500px"
      minW="250px"
      w="100%"
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
      <CardBody px={0} py={2}>
        <Stack spacing={2} height={'100%'} justify={'space-between'} fontSize="sm">
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Text>
                {review.makeName} {review.modelName}
              </Text>

              <Text>{review.date}</Text>
            </Flex>

            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Text>
                {review.registration}
              </Text>
              <Flex
              gap={'1px'}
              fontSize="xs"
              align="baseline"
              alignSelf="flex-end"
              alignItems="center"
              >
                <StarIcon boxSize="3" />{' '}
                {/* Adjusts the star icon to be slightly smaller */}
                <Box mr="5px">{review.rating}</Box>
                <Text fontSize="md">{review.customerName} {review.customerSurname}</Text>
              </Flex>
            </Flex>
            <Divider
              borderWidth="2px"
              borderColor="transparent"
              background="linear-gradient(to right, blue, lightblue)"
              height="1px"
            />
            <Text>{review.description}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
