'use client';

import React from 'react';
import { Box, Flex, Heading, Text, Icon, Avatar } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

interface ReviewProps {
  rating: number;
  firstName: string;
  lastName: string;
  reviewDate: string;
  description: string;
}

export const ReviewItem: React.FC<ReviewProps> = ({
  rating,
  firstName,
  lastName,
  reviewDate,
  description,
}) => {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="sm"
      bg="brandwhite"
      _hover={{ boxShadow: 'md' }}
      maxWidth="auto"
      width="100%"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Flex alignItems="center" gap={3}>
          <Avatar name={`${firstName} ${lastName}`} />
          <Box>
            <Heading size="sm">{`${firstName} ${lastName}`}</Heading>
            <Text fontSize="xs" color="gray.500">
              {new Date(reviewDate).toLocaleDateString()}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="center" gap={1}>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              color={index < rating ? 'yellow.400' : 'gray.300'}
            />
          ))}
        </Flex>
      </Flex>
      <Text fontSize="sm" color="gray.700">
        {description}
      </Text>
    </Box>
  );
};
