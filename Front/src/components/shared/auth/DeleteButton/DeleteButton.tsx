'use client';

import { swrKeys } from '@/fetchers/swrKeys';
import { ButtonProps, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure, chakra, Stack } from '@chakra-ui/react';
import { register } from 'module';
import { useRef } from 'react';
import useSWRMutation, { TriggerWithArgs, TriggerWithoutArgs } from 'swr/mutation';
import CustomInput from '../CustomInput';
import SubmitButton from '../SubmitButton';
import { IDelete, IEditUser } from '@/typings/users/user.type';
import { useForm } from 'react-hook-form';
import { updateProfile } from '@/mutation/profile';

interface DeleteButtonProps extends ButtonProps {
  label?: string;
  password?: string
}

export default function DeleteButton({
  label = "Delete",
  password = "amongus",
  ...rest
}: DeleteButtonProps) {
  const {
    handleSubmit,
    formState: { errors },
    register,
    clearErrors,
    setError,
    reset
  } = useForm<{password: string, check: string}>();

  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const { trigger } = useSWRMutation(swrKeys.deleteuser, updateProfile<IDelete>, {
    onSuccess: () => {
      console.log("Account deleted")
    },
    onError: () => {
      console.log("Something went wrong!")
    },
  });

  const onSubmit = (data: { password: string; check: string }) => {
    const { password } = data;
    onDeleteProfile({ password });
    onClose();
    reset();
  };

  const onDeleteProfile = async (data: IDelete) => {
    if (password !== data.password) {
      setError('password', {
        type: 'manual',
        message: 'Wrong Password, make sure to enter your current password',
      });
      return;
    }
    clearErrors();
    await trigger(data);
  };

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
          <chakra.form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack spacing={4}>
                <CustomInput
                  {...register('password', {
                    required: 'Must enter current password',
                    validate: (value) =>
                      value === password || 'Wrong password',
                  })}
                  label="Enter Password"
                  type="password"
                  placeholder="Enter your current password"
                  error={errors.password?.message}
                />
                <CustomInput
                  {...register('check', {
                    required: 'Must enter correct phrase',
                    validate: (value) =>
                      value === "It's not you, it's me" || 'Wrong phrase',
                  })}
                  label={`Type: "It's not you, it's me"`}
                  type="text"
                  placeholder="It's not you, it's me"
                  error={errors.check?.message}
                />
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
                Cancel
            </Button>
            <Button colorScheme="red" type='submit' ml={3}>
                Delete
            </Button>
            </AlertDialogFooter>
          </chakra.form>
        </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
    </>
  );
}
