import {
  ModalContent,
  chakra,
  ModalCloseButton,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Textarea,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from '@chakra-ui/react';
import CustomInput from '../auth/CustomInput';
import { IReview } from '@/typings/users/user.type';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { Overlay } from '../filter/overlay/Overlay';
import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { CustomPost } from '@/fetchers/post';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { HStack, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { ICar } from '@/typings/vehicles/vehicles.type';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: ICar;
}

export default function ReviewForm({
  isOpen,
  onClose,
  vehicle,
}: ReviewFormProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitting, isSubmitSuccessful: success},
    clearErrors,
    register,
    setValue,
    reset
  } = useForm<IReview>();

  const { trigger } = useSWRMutation(
    swrKeys.addReview(vehicle.rent_id || ''),
    CustomPost<IReview>,
    {
      onSuccess: () => {
        console.log('Saved changes');
      },
      onError: () => {
        console.log('Something went wrong!');
      },
    }
  );

  const onSubmit = async (data: IReview) => {
    clearErrors();
    await trigger(data);
  };

  const router = useRouter();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <Overlay />
      <ModalContent>
        {isSubmitted ? (
          <>
            <ModalHeader>{success ? `Thank you for your feedback!` : `Something went wrong: ${errors.root?.message}`}</ModalHeader>
            <ModalCloseButton />
            <ModalFooter>
              <Button
                {...!success? {display: "none"} : {}}
                onClick={() => router.push(`/offer/:${vehicle.offer_id}`)}
                mr={3}
              >
                Go to offer
              </Button>
              <Button
                color="white"
                bg="brandblue"
                _hover={{
                  color: 'brandblack',
                  bg: 'brandyellow',
                }}
                onClick={() => success ? onClose() : reset()}
                mr={3}
              >
                {success ? `Exit` : `Retry`}
              </Button>
            </ModalFooter>
          </>
        ) : (
          <chakra.form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader width={'90%'}>
              {`Leave a Review for ${vehicle.companyName}'s ${vehicle.makeName} ${vehicle.modelName}`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src={vehicle.image}
                alt={`${vehicle.modelName} car`}
                objectFit={'contain'}
                width="100%"
                height="160px" // Fixed height for images
                borderRadius="md"
              />
              <StarRating setValue={setValue}/>
              <Textarea
                mt={4}
                placeholder="Write your review here..."
                {...register('description')}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => router.push(`/offer/:${vehicle.offer_id}`)}
                mr={3}
              >
                Go to offer
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
                Submit{isSubmitting && 'ing...'}
              </Button>
            </ModalFooter>
          </chakra.form>
        )}
      </ModalContent>
    </Modal>
  );
}

interface StarRatingProps extends InputProps {
  stars?: number;
  label?: string;
  spacing?: number;
  starSize?: number;
  setValue: UseFormSetValue<IReview>
}

export function StarRating({
  stars = 5,
  label = '',
  spacing = 1,
  starSize = 8,
  setValue,

}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(1);

  useEffect(() => {
    if (setValue) {
        setValue("rating", rating);
    }
  }, [rating]);

  let items = Array.from({ length: stars }, (_, index) => (
    <Icon
      key={index}
      as={FaStar}
      boxSize={starSize}
      cursor="pointer"
      color={index + 1 <= (hover || rating) ? 'yellow.400' : 'gray.300'}
      onClick={() => setRating(index + 1)}
      onMouseEnter={() => setHover(index + 1)}
      onMouseLeave={() => setHover(0)}
    />
  ));

  return (
    <>
      {label !== '' && <FormLabel>{label}</FormLabel>}
      <HStack spacing={spacing}>{items}</HStack>
    </>
  );
}
