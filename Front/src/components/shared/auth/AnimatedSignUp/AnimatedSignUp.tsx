'use client';

import { ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { Text } from '@chakra-ui/react';
import NextLink from 'next/link';

export const AnimatedSignUp = () => {
  return (
    <Text color="brandblue" fontWeight="semibold">
      <motion.span
        initial={{ opacity: 1, x: 0 }} // Početni položaj
        whileHover={{ opacity: 1, x: 4 }} // Pomakni tekst udesno pri hoveru
        transition={{ duration: 0.3 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Text
          as={NextLink}
          href="/register"
          color={'brandblue'}
          fontWeight={'semibold'}
        >
          Sign up
          <ChevronRightIcon fontWeight={'semibold'} />
        </Text>
      </motion.span>
    </Text>
  );
};
