'use client';

import './style.css';
import VehicleList from '@/components/shared/cars/VechileList/VechileList';
import useSWR from 'swr';
import { swrKeys } from '@/fetchers/swrKeys';
import { CustomGet } from '@/fetchers/get';
import React, { useEffect, useState } from 'react';
import {
  Flex,
  useDisclosure,
  Box,
  Heading,
  Text,
  Button,
  Divider,
  useBreakpointValue,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
  ModalCloseButton,
  ModalBody,
  chakra,
  useToast,
} from '@chakra-ui/react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcStripe,
} from 'react-icons/fa';
import { CustomHeader as Header } from '@/components/shared/Header/CustomHeader/CustomHeader';
import { HeaderButton } from '@/components/shared/Header/Header';
import Footer from '@/components/shared/Footer/Footer';
import { useUserContext } from '@/context/UserContext/UserContext';
import LogOutButton from '@/components/shared/auth/LogOutButton/LogOutButton';
import {
  ICar,
  IRentalEntry,
  IReviewable,
  toOffer,
} from '@/typings/vehicles/vehicles.type';
import ChatMenu, { ChatIcon } from '@/components/shared/chat/ChatMenu';
import useSWRMutation from 'swr/mutation';
import { CustomPost } from '@/fetchers/post';
import CustomInput from '@/components/shared/auth/CustomInput';
import { useForm } from 'react-hook-form';
import { Overlay } from '@/components/shared/filter/overlay/Overlay';
import ChatbotWidget from '@/components/shared/ChatbotWidget/ChatbotWidget';

// Footer links (unchanged)
const userProfileFooterLinks = {
  quickLinks: [
    { label: 'Home', href: '/home' },
    { label: 'About Us', href: '/home' },
    { label: 'FAQ', href: '/home#faq-section' },
    { label: 'Contact Us', href: '/TalkToUs' },
  ],
  contactInfo: {
    phone: '+385 95 517 1890',
    email: 'support@easyrent.com',
    address: 'Unska ul. 3, 10000, Zagreb',
  },
  socialLinks: [
    { label: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
    { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
    { label: 'Twitter', href: 'https://twitter.com', icon: FaTwitter },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  ],
  paymentIcons: [FaCcVisa, FaCcMastercard, FaCcStripe],
};

export default function UserProfilePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch user rentals
  const { data: entries } = useSWR(
    swrKeys.userRentals,
    CustomGet<IRentalEntry[]>
  );

  // Current user
  const { user } = useUserContext();

  // Modal for buying gems
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch user balance
  const { data: balance } = useSWR(
    swrKeys.getBalance,
    CustomGet<{ Balance: number }>
  );

  // Fake "styles loaded" state
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsStylesLoaded(true);
    }, 100); // short delay
    return () => clearTimeout(timeout);
  }, []);

  // State for grouping vehicles into "ongoing" vs. "previously rented"
  const [currentRentals, setCurrentRentals] = useState<ICar[]>([]);
  const [previouslyRented, setPreviouslyRented] = useState<ICar[]>([]);

  // On receiving `entries` from backend, split them
  useEffect(() => {
    if (!Array.isArray(entries)) return;

    // "Ongoing" means it hasn't passed the return date yet
    const curr = entries
      .filter((rental) => new Date(rental.dateTimeReturned) > new Date())
      .map((rental) => {
        // Convert IRentalEntry → IReviewable
        const item = toOffer(rental) as IReviewable;

        // Mark whether it's already rated
        item.rated = !rental.canReview;

        // Add optional fields for "rental details"
        item.rentalFrom = rental.dateTimeRented;
        item.rentalTo = rental.dateTimeReturned;

        return item;
      })
      // Sort so that un-rated rentals appear first
      .sort((a, b) => {
        // a.rated = false means user can still review it
        if (a.rated === false && b.rated !== false) return -1;
        if (b.rated === false && a.rated !== false) return 1;
        return 0;
      });

    // "Previously rented" means the return date has passed
    const prev = entries
      .filter((rental) => new Date(rental.dateTimeReturned) <= new Date())
      .map((rental) => {
        const item = toOffer(rental) as IReviewable;
        // Possibly also add the rentalFrom/rentalTo if you want
        item.rentalFrom = rental.dateTimeRented;
        item.rentalTo = rental.dateTimeReturned;
        return item;
      });

    setCurrentRentals(curr);
    setPreviouslyRented(prev);
  }, [entries]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Some responsive values
  const gapSize = useBreakpointValue({
    base: 6,
    md: 8,
    lg: 10,
    xl: 10,
  });
  const headingSize = useBreakpointValue({ base: '2xl', lg: '2xl' });
  const rentalswidth = useBreakpointValue({ base: '100%', lg: '88%' });
  const rentalAlignment = useBreakpointValue({
    base: 'center',
    lg: 'space-between',
  });

  if (!isStylesLoaded) {
    return null; // Do not render anything until styles are loaded
  }

  return (
    <Flex
      direction="column"
      grow={1}
      bg="brandlightgray"
      minH="100vh"
      justify="space-between"
    >
      {/* Buy Gems Modal */}
      <FundsModal onClose={onClose} isOpen={isOpen} />

      {/* Chatbot Widget */}
      <ChatbotWidget />

      {/* Header */}
      <Header>
        <Text fontSize="md" fontWeight="bold" color="brandblue">
          {`Balance: ${balance?.Balance || 0}💎`}
        </Text>

        <Button
          onClick={onOpen}
          bgColor="brandblue"
          color="brandwhite"
          size="sm"
          _hover={{
            bg: 'brandyellow',
            color: 'brandblack',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
        >
          Buy Gems
        </Button>

        <HeaderButton href="/editProfile">Edit profile</HeaderButton>
        <LogOutButton useAlt={false} />
      </Header>

      {/* Main Content */}
      <Box position="relative" width="100%">
        <Flex
          mx="auto"
          justify={isChatOpen ? { rentalAlignment } : 'center'}
          align="stretch"
          width="100%"
          p={gapSize}
          gap={gapSize}
          wrap="nowrap"
          direction={{ base: 'column', lg: 'row' }}
        >
          {/* Rentals Section */}
          <Flex
            direction="column"
            width={rentalswidth}
            bg="brandwhite"
            boxShadow="base"
            borderRadius="md"
            p={gapSize}
            gap={gapSize}
          >
            <Heading size={headingSize} color="brandblue">
              {user.firstName ? `${user.firstName}'s Profile` : 'Your Profile'}
            </Heading>
            <Divider />

            {currentRentals && currentRentals.length > 0 ? (
              <VehicleList
                justify="flex-start"
                vehicles={currentRentals}
                description="Ongoing rentals:"
                /**
                 * If we set showRentalDetailsOnClick to 'true',
                 * each card with rentalFrom/rentalTo will open a modal
                 * (unless it's reviewable).
                 */
                showRentalDetailsOnClick
              />
            ) : (
              <Heading size="md" color="brandblue" opacity={0.5}>
                No ongoing rentals
              </Heading>
            )}

            {previouslyRented && previouslyRented.length > 0 ? (
              <VehicleList
                justify="flex-start"
                vehicles={previouslyRented}
                description="Previously rented:"
                showRentalDetailsOnClick
              />
            ) : (
              <Heading size="md" color="brandblue" opacity={0.5}>
                No previous rentals
              </Heading>
            )}
          </Flex>

          {/* Chat Section */}
          {isChatOpen ? (
            <ChatMenu
              onClose={toggleChat}
              isOpen={isChatOpen}
              chats={[
                { name: 'Admin' },
                { name: 'Company 1' },
                { name: 'Company 2' },
                { name: 'Company 3' },
              ]}
            />
          ) : (
            <ChatIcon
              onClick={toggleChat}
              position="absolute"
              right={{ base: 5, lg: gapSize }}
              top={gapSize}
            />
          )}
        </Flex>
      </Box>

      <Footer links={userProfileFooterLinks} />
    </Flex>
  );
}

/**
 * Modal for buying gems
 */
interface FundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setBalance?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

function FundsModal({ isOpen, onClose }: FundsModalProps) {
  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    register,
  } = useForm<{ amount: number }>();
  const toast = useToast();

  // SWR Mutation for buying gems
  const { trigger: walletTrigger } = useSWRMutation(
    swrKeys.buyGems,
    CustomPost,
    {
      onSuccess: (data: any) => {
        if (data?.detail) {
          console.log(data?.trans_id);
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              localStorage.setItem('trans_id', data.trans_id);
              console.log('Transaction ID saved:', data.trans_id);
            } catch (error) {
              console.error('Error saving to localStorage:', error);
            }
          }
          if (data.detail.includes('stripe.com')) {
            window.location.href = data.detail;
          } else {
            toast({
              title: 'Success',
              description: data.detail,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
        }
      },
      onError: (error: any) => {
        // If the backend returns "Insufficient funds." or some other error
        toast({
          title: 'Error',
          description: `Something went wrong with the transaction. ${error}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  // Called when user submits the "Buy Gems" form
  const onAddFunds = async (data: { amount: number }) => {
    onClose();
    clearErrors();
    await walletTrigger(data);
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <Overlay />
      <ModalContent>
        <chakra.form onSubmit={handleSubmit(onAddFunds)}>
          <ModalHeader>Buy Gems</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}></Text>
            <CustomInput
              {...register('amount', {
                required: 'Must enter valid amount',
              })}
              label="Enter Number of Gems"
              type="number"
              placeholder="100💎 = 1€"
              error={errors.amount?.message}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="white"
              bg="brandblue"
              _hover={{
                color: 'brandblack',
                bg: 'brandyellow',
              }}
            >
              Buy
            </Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  );
}
