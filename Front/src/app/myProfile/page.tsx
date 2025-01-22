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
  ModalProps,
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
  const { data: entries } = useSWR(
    swrKeys.userRentals,
    CustomGet<IRentalEntry[]>
  );
  const { user } = useUserContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isStylesLoaded, setIsStylesLoaded] = useState(false);

  useEffect(() => {
    // Simulating style loading completion with a short delay
    const timeout = setTimeout(() => {
      setIsStylesLoaded(true);
    }, 100); // Adjust timing as needed

    return () => clearTimeout(timeout);
  }, []);

  const [currentRentals, setCurrent] = useState([] as ICar[])
  const [previouslyRented, setPrevious] = useState([] as ICar[])

  useEffect (() => {
    console.log("logging", entries, Array.isArray(entries))

    const prev = Array.isArray(entries) ? entries.filter((vehicle) => new Date(vehicle.dateTimeReturned) > new Date())
      .map((vehicle) => {
        let item = toOffer(vehicle) as IReviewable;
        item.rated = !vehicle.canReview;
        // console.log(item)
        return item;
      }).sort((v, _) => v.rated === undefined || v.rated ? 1 : -1) : [];

    const curr = Array.isArray(entries) ? entries.filter((vehicle) => new Date(vehicle.dateTimeReturned) <= new Date())
    .map((vehicle) => {
      // console.log(toOffer(vehicle))
      return toOffer(vehicle);
    }) : [];

    console.log(prev);
    console.log(curr);

    if (prev.length > 0) setPrevious(prev);
    if (curr.length > 0) setCurrent(curr)

    console.log(previouslyRented);
    console.log(currentRentals)

  }, [entries]) 
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const gapSize = useBreakpointValue({
    base: 6, // Small gap for small screens (mobile)
    md: 8, // Slightly larger gap for medium screens (laptop/tablet)
    lg: 10, // Largest gap for large screens (desktop)
    xl: 10,
  });

  const headingSize = useBreakpointValue({
    base: '2xl',
    lg: '2xl',
  });

  const rentalswidth = useBreakpointValue({
    base: '100%',
    lg: '88%',
  });

  const rentalAllignment = useBreakpointValue({
    base: 'center',
    lg: 'space-between',
  });

  if (!isStylesLoaded) {
    return null; // Do not render anything until styles are loaded
  }

  return (
    <Flex direction="column" grow={1} bg="brandlightgray" minH="100vh">
      {/* Add Funds Modal */}
      <FundsModal onClose={onClose} isOpen={isOpen}/>

      {/* Header */}
      <Header>
        <Text fontSize="md" fontWeight="bold" color="brandblue">
          {`Balance: ${user.balance ? user.balance : 0}€`}
        </Text>

        <Button
          onClick={() => {
            onOpen();
          }}
          bgColor={'brandblue'}
          color={'brandwhite'}
          size="sm"
          _hover={{
            bg: 'brandyellow',
            color: 'brandblack',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          }}
        >
          Add funds
        </Button>

        <HeaderButton href="/editProfile">Edit profile</HeaderButton>

        <LogOutButton useAlt={false} />
      </Header>

      {/* Main Content */}
      <Box position="relative" width="100%">
        {/* Rentals */}
        <Flex
          mx="auto"
          justify={isChatOpen ? { rentalAllignment } : 'center'}
          align="stretch"
          width={'100%'}
          p={gapSize}
          gap={gapSize}
          wrap={'nowrap'}
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
              {`${user.firstName ? `${user.firstName}'s` : 'Your'} Profile`}
            </Heading>
            <Divider />
            {currentRentals && currentRentals.length > 0 ? (
              <VehicleList 
                justify={"flex-start"}
                vehicles={previouslyRented} 
                description="Ongoing rentals:"
              />
            ) : (
              <Heading size = "md" color = "brandblue" opacity={0.5} >No ongoing rentals</Heading>
            )}
            {previouslyRented && previouslyRented.length > 0 ? (
              <VehicleList
                justify={"flex-start"}
                vehicles={previouslyRented}
                description="Previously rented:"
              />
            ) : (
              <Heading size="md" color = "brandblue" opacity={0.5} >No previous rentals</Heading>
            )}
          </Flex>

          {/* Chats Section (UNIMPLEMENTED) */}
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

interface FundsModalProps {
  isOpen : boolean,
  onClose : () => void,
}

function FundsModal ({
  isOpen,
  onClose,
}:FundsModalProps) {
  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    register,
  } = useForm<{ amount: number }>();

  const onAddFunds = async (data: { amount: number }) => {
    onClose();
    clearErrors();
    await walletTrigger(data);
  };

  const {user} = useUserContext()

  const { trigger: walletTrigger } = useSWRMutation(
    swrKeys.addBalance(user.user_id),
    CustomPost<{ amount: number }>,
    {
      onSuccess: () => {
        console.log('Saved changes');
      },
      onError: () => {
        console.log('Something went wrong!');
      },
    }
  );

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <Overlay />
    <ModalContent>
      <chakra.form onSubmit={handleSubmit(onAddFunds)}>
        <ModalHeader>Add Funds</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>Enter the amount you want to add:</Text>
          <CustomInput
            {...register('amount', {
              required: 'Must enter valid amout',
            })}
            label="Amount (€)"
            type="number"
            placeholder="Enter amount to add"
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
            Add Funds
          </Button>
        </ModalFooter>
      </chakra.form>
    </ModalContent>
  </Modal>
  )
}