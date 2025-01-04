'use client';

import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

interface ISupportButton extends ButtonProps {
  children: React.ReactNode;
  m?: string; // Optional margin to avoid issues
  href: string;
}

export default function SupportButton({
  children,
  m,
  href,
  ...rest
}: ISupportButton) {
  return (
    <Button
      as="a"
      bg="brandlightgray"
      borderRadius="md"
      p={{ base: 4, md: 5 }} // Responsive padding
      m={m} // Optional margin
      href={href}
      _hover={{
        bg: 'brandblue',
        color: 'brandwhite',
        textDecoration: 'none', // Ensure no underline on hover
        transition: 'all 0.3s ease', // Smooth hover animation
      }}
      _focus={{
        boxShadow: '0 0 0 2px brandblue',
      }}
      _active={{
        bg: 'brandmiddlegray',
      }}
      {...rest} // Pass additional props
    >
      {children}
    </Button>
  );
}
