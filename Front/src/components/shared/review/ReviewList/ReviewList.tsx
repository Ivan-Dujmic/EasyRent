'use client';

import React, { useState } from 'react';
import { Flex, IconButton, Box, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { ReviewItem } from '../ReviewItem/ReviewItem';
import { IReview } from '@/typings/users/user.type';

interface ReviewListProps {
  reviews: IReview[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

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
