"use client";

import { IReview } from '@/typings/reviews/reviews.type';
import { StarIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Stack,
  Box,
  Text,
  Flex,
  Divider,
} from '@chakra-ui/react';

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
                <Box mr="5px" fontSize="md">{review.ratings}</Box>
                <Text fontSize="md">{review.firstName} {review.lastName}</Text>
              </Flex>
            </Flex>
            <Divider
              borderWidth="2px"
              borderColor="transparent"
              background="linear-gradient(to right, blue, lightblue)"
              height="1px"
            />
            <Text>{review.descriptions}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
