'use client';

import { ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { Text } from '@chakra-ui/react';
import NextLink from 'next/link';

interface AnimatedMyProfileProps {
  color?: string; // Optional color prop with default value
}

export const AnimatedMyProfile = ({
  color = 'brandblue',
}: AnimatedMyProfileProps) => {
  return (
    <Text fontWeight="semibold">
      <motion.span
        initial={{ opacity: 1, x: 0 }} // Initial position
        whileHover={{ opacity: 1, x: 4 }} // Shift text to the right on hover
        transition={{ duration: 0.3 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Text
          as={NextLink}
          href="/myProfile"
          color={color} // Use the optional color prop
          fontWeight={'semibold'}
        >
          My profile
          <ChevronRightIcon fontWeight={'semibold'} />
        </Text>
      </motion.span>
    </Text>
  );
};
