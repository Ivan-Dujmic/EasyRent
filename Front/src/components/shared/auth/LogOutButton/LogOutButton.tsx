'use client';

import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { useUserContext } from '@/context/UserContext/UserContext';
import useSWRMutation from 'swr/mutation';
import { CustomPost } from '@/fetchers/post';
import { swrKeys } from '@/fetchers/swrKeys';

export default function LogOutButton() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { setUser } = useUserContext();
    const router = useRouter();

    const { trigger, isMutating } = useSWRMutation(
        swrKeys.logout,
        CustomPost,
        {
            onSuccess: () => {
                // Reset user context to guest
                Cookies.remove('sessionid');
                Cookies.remove('csrftoken');
                setUser({ role: 'guest' });
                router.push('/home');
            },
            onError: (error) => {
                console.error('Logout failed:', error);
                alert('Something went wrong. Please try again later.');
            },
        }
    );

    const handleLogout = async () => {
        await trigger(); // Trigger the logout API
        onClose(); // Close modal
    };

    return (
        <>
            <Button
                bg={'brandblue'}
                color={'white'}
                fontWeight={'semibold'}
                fontSize="sm"
                _hover={{
                    bg: 'brandyellow',
                    color: 'brandblack',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onClick={onOpen}
            >
                Log out
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="lg" bg="brandwhite" boxShadow="xl">
                    <ModalHeader textAlign="center" fontWeight="bold" fontSize="lg">
                        Confirm Logout
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text textAlign="center" fontSize="md" color="brandblack" mt={2}>
                            Are you sure you want to log out?
                        </Text>
                        <Text textAlign="center" fontSize="sm" color="brandgray" mt={1}>
                            You’ll need to log back in to access your account.
                        </Text>
                    </ModalBody>
                    <ModalFooter justifyContent="center" gap={4}>
                        <Button
                            color="brandwhite"
                            bg="brandblue"
                            _hover={{
                                bg: 'brandyellow',
                                color: 'brandblack',
                            }}
                            onClick={handleLogout}
                            size="md"
                            isLoading={isMutating}
                        >
                            Yes, Log Out
                        </Button>
                        <Button
                            color="brandblack"
                            bg="brandmiddlegray"
                            _hover={{
                                bg: 'brandlightgray',
                            }}
                            onClick={onClose}
                            size="md"
                        >
                            No, I want to stay
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
