'use client';

import { swrKeys } from '@/fetchers/swrKeys';
import { Text, ButtonProps, Button, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, useDisclosure, chakra, Stack, Heading, Modal, ModalBody, ModalContent, ModalHeader } from '@chakra-ui/react';
import { register } from 'module';
import { useRef, useState } from 'react';
import useSWRMutation, { TriggerWithArgs, TriggerWithoutArgs } from 'swr/mutation';
import CustomInput from '../CustomInput';
import SubmitButton from '../SubmitButton';
import { IDelete, IEditUser, IUser } from '@/typings/users/user.type';
import { useForm } from 'react-hook-form';
import { CustomPost } from '@/fetchers/post';
import SuccessWindow from '../../SuccessWidnow/SuccessWidnow';
import { Overlay } from '../../filter/overlay/Overlay';
import Cookies from 'js-cookie'
import { useUserContext } from '@/context/UserContext/UserContext';

interface DeleteButtonProps extends ButtonProps {
  label?: string;
}

export default function DeleteButton({
  label = "Delete",
  ...rest
}: DeleteButtonProps) {
  const [success, setSuccess] = useState(false)
  const {
    handleSubmit,
    formState: { errors },
    register,
    clearErrors,
    reset
  } = useForm<{password: string, check: string}>();

  const cancelRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {setUser} = useUserContext()
  
  const { trigger } = useSWRMutation(swrKeys.deleteUser, CustomPost<IDelete>, {
    onSuccess: () => {
      setSuccess(true)
      Cookies.remove('sessionid');
      Cookies.remove('csrftoken');
      setUser({ role: 'guest' } as IUser);
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
    clearErrors();
    await trigger(data);
  };

  return (
    <>
    <Modal isOpen={success} onClose={onClose}>
      <Overlay/>
      <ModalContent>
        <SuccessWindow 
          mt={0}
          title='Account Deleted'
          returnPage={{name: "Home Page", link: "/home"}}
        >
          <Text>
            We are sad to see you go but wish you luck on your journey! 
          </Text>
        </SuccessWindow>
      </ModalContent>
    </Modal>
    <Button
      type="button"
      borderRadius="md"
      bg="crimson"
      border="2px solid"
      color="brandblack"
      borderColor="white"
      _hover={{
        bg: 'brandwhite',
        color: 'brandblack',
        border: "2px solid",
        borderColor: "crimson",
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
