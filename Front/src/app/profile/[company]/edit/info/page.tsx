'use client';

import {
  chakra,
  Box,
  Heading,
  VStack,
  Flex,
  Text,
  useBreakpointValue,
  Input,
  Image,
  Button,
  border
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { ILogIn } from '@/typings/logIn/logIn.type';

import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { logIn } from '@/mutation/login';
import { useRouter } from 'next/navigation';
import SucessLoginWindow from '@/components/shared/SuccessWidnow/SucessLoginWindow';
import { FcGoogle } from 'react-icons/fc';
import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';

interface IInfo {
    img: string,
    company: string,
    phoneNumber: string,
    description: string
}


export default function EditInfo() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    control,
    setValue
  } = useForm<IInfo>();
  const router = useRouter();
  const [preview, setPreview] = useState("slika");

  const { trigger } = useSWRMutation(swrKeys.logIn, logIn, {
    onSuccess: (data) => {
      router.push('/company/${company}/info');
    }
  });

  const onSave = async (data: IInfo) => {
    clearErrors();
    await trigger(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setValue('img', reader.result as string); // Store in React Hook Form
        setPreview(reader.result as string); // Show preview
      };
    }
  };

  const boxWidth = useBreakpointValue({
    base: '90vw', // Small screens
    md: '70vw', // Medium screens
    lg: '50vw', // Large screens
  });

  const buttonWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: '32%', // Fit three buttons side by side on medium screens
    lg: '30%', // Slightly smaller on large screens for spacing
  });

  return (
    <Box
      width={boxWidth}
      margin="0 auto"
      mt="10"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
    >
      <chakra.form onSubmit={handleSubmit(onSave)}>
        <VStack spacing={6} alignItems="start">
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Input
              type="file"
              accept="image/*"
              hidden
              required
              id="fileInput"
              {...register("img")}
              onChange={handleImageUpload}
            />
            <Button as="label" htmlFor="fileInput" color="brandwhite" bgColor="brandblue" cursor="pointer"
            border="2px solid"
            borderColor="transparent"
            _hover={{
              bg: 'brandwhite',
              color: 'brandblack',
              borderColor: 'brandblue',
              transition: 'all 0.3s ease', // Smooth hover animation
            }}>
              Upload Logo
            </Button>

            {preview && (
              <Box textAlign="center" mr="10%">
                <Image src={preview} h="50px"/>
              </Box>
            )}
          </Flex>
            <CustomInput
              {...register('company')}
              label="Company name"
              type="text"
              value="${company}"
              error={errors.company?.message}
            />
            <CustomInput
              {...register('phoneNumber')}
              label="Phone number"
              type="tel"
              value="${phoneNumber}"
              error={errors.phoneNumber?.message}
            />
            <CustomInput
              {...register('description')}
              label="Description"
              type="text"
              value="${description}"
              error={errors.description?.message}
              h="30vh"
              as="textarea"
              p="10px"
            />

          {/* Button Layout */}
          <Flex
            gap={6}
            w="full"
            align="center"
            justify="center"
          >
            <SupportButton href="/profile/${company}/info" w={buttonWidth}>
              Cancel
            </SupportButton>
            {/* Save Button */}
            <SubmitButton
              label="Save"
              submittingLabel="Saving..."
              isSubmitting={isSubmitting}
              w={{ base: '100%', md: '50%' }}
            />
          </Flex>
        </VStack>
      </chakra.form>
    </Box>
  );
}
