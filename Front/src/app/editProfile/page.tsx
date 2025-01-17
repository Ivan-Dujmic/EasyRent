'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { swrKeys } from '@/fetchers/swrKeys';
import { IEditPassword, IEditUser, IGetUser, IRegisterUser } from '@/typings/users/user.type';
import {
  Box,
  VStack,
  Flex,
  chakra,
  useBreakpointValue,
  TabPanel,
  TabList,
  Heading,
  Tab,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import DeleteButton from '@/components/shared/auth/DeleteButton/DeleteButton';
import { CustomGet } from '@/fetchers/homeData';
import useSWR from 'swr';
import { updateProfile } from '@/mutation/profile';

export default function EditPage() {
  const {
    handleSubmit: handleUser,
    formState: { isSubmitting: isSubUser, errors: errUser },
    clearErrors : clearErrUser,
    register : registerUser,
  } = useForm<IEditUser>();

  const {
    handleSubmit: handlePass,
    formState: { isSubmitting: isSubPass, errors: errPass },
    setError: setErrPass,
    clearErrors : clearErrPass,
    getValues : getValPass,
    register : registerPass,
  } = useForm<IEditPassword>();

  let [success, setSuccess] = useState(false)
  const {data: dataGet, error, isLoading} = useSWR(swrKeys.profileuser, CustomGet<IGetUser>)

  const { trigger: updateTrigger } = useSWRMutation(swrKeys.profileuser, updateProfile<IEditUser>, {
    onSuccess: () => {
      setSuccess(true)
      console.log("Saved changes")
    },
    onError: () => {
      console.log("Something went wrong!")
    },
  });

  const { trigger: passTrigger } = useSWRMutation(swrKeys.profileuser, updateProfile<IEditPassword>, {
    onSuccess: () => {
      setSuccess(true)
      console.log("Saved changes")
    },
    onError: () => {
      console.log("Something went wrong!")
    },
  });

  const onUpdateProfile = async (data: IEditUser) => {
    clearErrUser();
    await updateTrigger(data);
  };

  const onResetPassword = async (data: IEditPassword) => {
    if (dataGet?.password !== data.oldPassword) {
      setErrPass('password', {
        type: 'manual',
        message: 'Wrong Password, make sure to enter your original password',
      });
      return;
    }
    if (data.password.length < 8) {
      setErrPass('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters',
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      setErrPass('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    clearErrPass();
    await passTrigger(data);
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
              <chakra.form onSubmit={handleUser(onUpdateProfile)}>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  wrap="wrap"
                  gap={6}
                  justify="space-between"
                >
                  <VStack spacing={4} w={inputWidth}>
                    <CustomInput
                      {...registerUser('firstName', {
                        required: 'Must enter your first name',
                      })}
                      label="First name"
                      type="text"
                      defaultValue={dataGet?.firstName}
                      placeholder="Enter your first name"
                      error={errUser.firstName?.message}
                    />
                    <CustomInput
                      {...registerUser('lastName', {
                        required: 'Must enter your last name',
                      })}
                      label="Last name"
                      type="text"
                      defaultValue={dataGet?.lastName}
                      placeholder="Enter your last name"
                      error={errUser.lastName?.message}
                    />
                    <CustomInput
                      {...registerUser('driversLicense', {
                        required: "Driver's license is required",
                      })}
                      label="Driver's license"
                      type="text"
                      defaultValue={dataGet?.driversLicense}
                      placeholder="Enter your driver's license id"
                      error={errUser.driversLicense?.message}
                    />
                  </VStack>
                  <VStack spacing={4} w={inputWidth}>
                    <CustomInput
                      {...registerUser('phoneNo', {
                        required: 'Phone number is required',
                      })}
                      label="Phone number"
                      type="tel"
                      defaultValue={dataGet?.phoneNo}
                      placeholder="Enter your phone number"
                      error={errUser.phoneNo?.message}
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
                    isSubmitting={isSubUser}
                    w={{ base: '100%', md: '30%' }}
                  />
                </Flex>
              </chakra.form>
            </TabPanel>
            <TabPanel>
              <chakra.form onSubmit={handlePass(onResetPassword)}>
                <VStack spacing={4}>
                  <CustomInput
                    {...registerPass('oldPassword', {
                      required: 'Must enter old password'
                    })}
                    label="Current Password"
                    type="password"
                    placeholder="Enter your old password"
                    error={errPass.oldPassword?.message}
                  />
                  <CustomInput
                    {...registerPass('password', {
                      required: 'Must enter password',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    error={errPass.password?.message}
                  />
                  <CustomInput
                    {...registerPass('confirmPassword', {
                      required: 'Password confirmation is required',
                      validate: (value) =>
                        value === getValPass('password') || 'Passwords do not match',
                    })}
                    label="Confirm New password"
                    type="password"
                    placeholder="Repeat new password"
                    error={errPass.confirmPassword?.message}
                  />
                  <SubmitButton
                    mt = {4}
                    alignSelf={'flex-start'} 
                    label="Reset Password"
                    submittingLabel="Trying to reset..."
                    isSubmitting={isSubPass}
                    w={{ base: '100%', md: '30%' }}
                  />
                </VStack>
              </chakra.form>
            </TabPanel>
            <TabPanel>
            <Box>
              Understand this: things are now in motion that cannot be undone.<br/>
              - Gandalf the Gray
            </Box>
            <DeleteButton 
              label = "Delete Account" 
              mt = "4"
              password = {dataGet?.password}
              float={"right"}
            />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}

