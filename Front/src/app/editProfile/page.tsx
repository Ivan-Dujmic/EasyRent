'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { swrKeys } from '@/fetchers/swrKeys';
import { updateProfile } from '@/mutation/profile';
import { IEditUser } from '@/typings/users/user.type';
import {
  Box,
  VStack,
  Flex,
  chakra,
  useBreakpointValue,
  TabPanel,
  TabList,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Tab,
  TabPanels,
  BoxProps,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import DeleteButton from '@/components/shared/auth/DeleteButton/DeleteButton';

export default function editPage() {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    setValue,
    getValues,
    setFocus,
    resetField,
    reset,
    register,
  } = useForm<IEditUser>();

  let [success, setSuccess] = useState(false)

  const { trigger } = useSWRMutation(swrKeys.profileuser, updateProfile, {
    onSuccess: () => {
      setSuccess(true)
      console.log("Saved changes")
    },
    onError: () => {
      
    },
  });

  const onUpdateProfile = async (data: IEditUser) => {
    clearErrors();
    await trigger(data);
  };

  const onResetPassword = async (data: IEditUser) => {
    if (data.password.length < 8) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters',
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    clearErrors();
    await trigger(data);
  };
  
  const boxWidth = useBreakpointValue({
    base: '90vw', // Small screens
    md: '70vw', // Medium screens
    lg: '50vw', // Large screens
  });

  const inputWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: '48%', // Two columns on medium and large screens
  });

  return success ? (
      <SuccessWindow />
    ) : (
    <Box
      width={boxWidth}
      margin="0 auto"
      my="10"
      p={{ base: 4, md: 6 }}
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      borderRadius="md"
      bg="brandwhite"
      >
      <Flex direction="column" align="center" width="100%" p={8}>
        <Heading mb={8} color="brandblue"> 
          Edit Profile 
        </Heading>
        <Tabs variant="enclosed" width="100%">
          <TabList>
            <Tab>Personal Information</Tab>
            <Tab>Password</Tab>
            <Tab>Delete Account</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <chakra.form onSubmit={handleSubmit(onUpdateProfile)}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  wrap="wrap"
                  gap={6}
                  justify="space-between"
                >
                  <VStack spacing={4} w={inputWidth}>
                    <CustomInput
                      {...register('firstName', {
                        required: 'Must enter your first name',
                      })}
                      label="First name"
                      type="text"
                      placeholder="Enter your first name"
                      error={errors.firstName?.message}
                    />
                    <CustomInput
                      {...register('lastName', {
                        required: 'Must enter your last name',
                      })}
                      label="Last name"
                      type="text"
                      placeholder="Enter your last name"
                      error={errors.lastName?.message}
                    />
                    <CustomInput
                      {...register('driversLicense', {
                        required: "Driver's license is required",
                      })}
                      label="Driver's license"
                      type="text"
                      placeholder="Enter your driver's license id"
                      error={errors.driversLicense?.message}
                    />
                  </VStack>
                  <VStack spacing={4} w={inputWidth}>
                    <CustomInput
                      {...register('phoneNo', {
                        required: 'Phone number is required',
                      })}
                      label="Phone number"
                      type="tel"
                      placeholder="Enter your phone number"
                      error={errors.phoneNo?.message}
                    />
                  </VStack>
                </Flex>
                {/* Buttons */}
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  gap={4}
                  mt={6}
                  justify="center"
                  align="center"
                >
                  <SupportButton href="/myProfile" w={{ base: '100%', md: '30%' }}>
                    Cancel
                  </SupportButton>
                  <SubmitButton
                    label="Save changes"
                    submittingLabel="Trying to save..."
                    isSubmitting={isSubmitting}
                    w={{ base: '100%', md: '30%' }}
                  />
                </Flex>
              </chakra.form>
            </TabPanel>
            <TabPanel>
              <chakra.form onSubmit={handleSubmit(onResetPassword)}>
                <VStack spacing={4}>
                  <CustomInput
                    {...register('oldPassword', {
                      required: 'Must enter old password'
                    })}
                    label="Current Password"
                    type="password"
                    placeholder="Enter your old password"
                    error={errors.password?.message}
                  />
                  <CustomInput
                    {...register('password', {
                      required: 'Must enter password',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    error={errors.password?.message}
                  />
                  <CustomInput
                    {...register('confirmPassword', {
                      required: 'Password confirmation is required',
                      validate: (value) =>
                        value === getValues('password') || 'Passwords do not match',
                    })}
                    label="Confirm New password"
                    type="password"
                    placeholder="Repeat new password"
                    error={errors.confirmPassword?.message}
                  />
                  <SubmitButton
                    mt = {4}
                    alignSelf={'flex-start'} 
                    label="Reset Password"
                    submittingLabel="Trying to reset..."
                    isSubmitting={isSubmitting}
                    w={{ base: '100%', md: '30%' }}
                  />
                </VStack>
              </chakra.form>
            </TabPanel>
            <TabPanel>
            <Box>
              Understand this: things are now in motion that cannot be undone.<br/>
              - Gandalf the Grey
            </Box>
            <DeleteButton 
              label = "Delete Account" 
              mt = "4"
              float={"right"}
              onDelete={deleteAccount}
            />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}

function deleteAccount () {
    console.log("Deleted account forever!")
}

