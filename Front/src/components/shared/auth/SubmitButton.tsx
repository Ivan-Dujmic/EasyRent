'use client';

import { ButtonProps, Button } from '@chakra-ui/react';

interface ISubmitButton extends ButtonProps {
  label: string;
  submittingLabel: string;
  m?: string; // Optional margin
  isSubmitting: boolean;
}

export default function SubmitButton({
  label,
  submittingLabel,
  m,
  isSubmitting,
  ...rest
}: ISubmitButton) {
  return (
    <Button
      type="submit"
      borderRadius="md"
      bg="brandblue"
      color="brandwhite"
      border="2px solid"
      borderColor="brandwhite"
      _hover={{
        bg: 'brandwhite',
        color: 'brandblack',
        borderColor: 'brandblue',
        transition: 'all 0.3s ease', // Smooth hover animation
      }}
      _disabled={{
        bg: 'gray.300',
        color: 'gray.600',
        cursor: 'not-allowed',
      }} // Style for disabled state
      p={{ base: 4, md: 5 }} // Padding adjusts for small and large screens
      m={m}
      disabled={isSubmitting}
      {...rest} // Pass any additional props
    >
      {isSubmitting ? submittingLabel : label}
    </Button>
  );
}
