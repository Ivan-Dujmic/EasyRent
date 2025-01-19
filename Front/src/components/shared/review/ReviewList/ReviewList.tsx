'use client';

import React, { useState } from 'react';
import { Flex, IconButton, Box, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { ReviewItem } from '../ReviewItem/ReviewItem';

interface Review {
  rating: number;
  firstName: string;
  lastName: string;
  reviewDate: string;
  description: string;
}

export interface ReviewListProps {
  reviews?: Review[]; // Optional because it can be undefined if there's an error
  error?: string; // Error message if no reviews are found
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  if (error) {
    return (
      <Flex direction="column" align="center" gap={4} width="100%">
        <Text fontSize="xl" fontWeight="bold" color="brandblue">
          No reviews found for this offer.
        </Text>
        <Text fontSize="md" color="gray.600">
          Be the first one to leave a review!
        </Text>
      </Flex>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Flex direction="column" align="center" gap={4} width="100%">
        <Text fontSize="xl" fontWeight="bold" color="gray.500">
          No reviews available.
        </Text>
        <Text fontSize="md" color="gray.600">
          This offer has no reviews yet. Stay tuned!
        </Text>
      </Flex>
    );
  }

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Flex direction="column" align="center" gap={4} width="100%">
      {/* Render Reviews */}
      {currentReviews.map((review, index) => (
        <ReviewItem key={index} {...review} />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex justifyContent="center" alignItems="center" gap={4}>
          <IconButton
            icon={<ChevronLeftIcon />}
            onClick={handlePrevPage}
            aria-label="Previous page"
            isDisabled={currentPage === 1}
          />
          <Text fontSize="sm" fontWeight="bold">
            Page {currentPage} of {totalPages}
          </Text>
          <IconButton
            icon={<ChevronRightIcon />}
            onClick={handleNextPage}
            aria-label="Next page"
            isDisabled={currentPage === totalPages}
          />
        </Flex>
      )}
    </Flex>
  );
};
