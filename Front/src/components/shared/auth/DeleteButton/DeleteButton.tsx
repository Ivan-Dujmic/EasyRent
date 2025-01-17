'use client';

import { ButtonProps, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';

interface DeleteButtonProps extends ButtonProps {
  label?: string;
  onDelete: () => void
}

export default function DeleteButton({
  label = "Delete",
  onDelete,
  ...rest
}: DeleteButtonProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <>
    <Button
      type="button"
      borderRadius="md"
      bg="red"
      border="2px solid"
      color="brandblack"
      borderColor="white"
      _hover={{
        bg: 'brandwhite',
        color: 'brandblack',
        border: "2px solid",
        borderColor: "red",
        transition: 'all 0.3s ease', // Smooth hover animation
      }}
      _disabled={{
        bg: 'gray.300',
        color: 'gray.600',
        cursor: 'not-allowed',
      }} // Style for disabled state
      p={{ base: 4, md: 5 }} // Padding adjusts for small and large screens
      disabled={isOpen}
      onClick={onOpen}
      {...rest} // Pass any additional props
    >
      {label}
    </Button>
    {/* Delete Account Confirmation Dialog */}
    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
    >
        <AlertDialogOverlay>
        <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
            Are you sure you want to delete your account? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
                Cancel
            </Button>
            <Button colorScheme="red" onClick={onDelete} ml={3}>
                Delete
            </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
    </>
  );
}
