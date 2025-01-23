'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import { swrKeys } from '@/fetchers/swrKeys';
import {
  IEditPassword,
  IEditUser,
  IGetUser,
} from '@/typings/users/user.type';
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
  Tabs
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import DeleteButton from '@/components/shared/auth/DeleteButton/DeleteButton';
import { CustomGet } from '@/fetchers/get';
import useSWR from 'swr';
import CustomHeader from '@/components/shared/Header/CustomHeader/CustomHeader';
import LogOutButton from '@/components/shared/auth/LogOutButton/LogOutButton';
import { AnimatedMyProfile } from '@/components/shared/user/AnimatedMyProfile/AnimatedMyProfile';
import { HeaderButton } from '@/components/shared/Header/Header';
import { CustomPut } from '@/fetchers/post';
import { useState, useEffect, useContext } from 'react';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { useUserContext } from '@/context/UserContext/UserContext';

export default function EditPage() {
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);

  const {data: dataGet} = useSWR(swrKeys.profileUser, CustomGet<IGetUser>);

  const boxWidth = useBreakpointValue({
    base: '90vw', // Small screens
    md: '70vw', // Medium screens
    lg: '50vw', // Large screens
  });

  const inputWidth = useBreakpointValue({
    base: '100%', // Full width on small screens
    md: '48%', // Two columns on medium and large screens
  });

  useEffect(() => {
    // Simulating style loading completion with a short delay
    const timeout = setTimeout(() => {
      setIsStylesLoaded(true);
    }, 100); // Adjust timing as needed

    return () => clearTimeout(timeout);
  }, []);

  if (!isStylesLoaded) {
    return null; // Do not render anything until styles are loaded
  }

  return (
    <Flex direction={"column"} width={"100%"} justify={"space-between"}>
    <CustomHeader 
          HeaderItems={
            // For larger screens
            <>
              <LogOutButton useAlt={false} />

              <AnimatedMyProfile/>
    
              {/* Small vertical line */}
              <Box height="4" borderLeft="1px" borderColor="brandgray" />
    
              <HeaderButton href="/TalkToUs"> Talk toah </HeaderButton>
            </>
          }
          MenuItems={
            // For smaller screens
            <>
              <LogOutButton useAlt={false} />

              <AnimatedMyProfile/>
              
              <HeaderButton href="/TalkToUs"> Talk toah </HeaderButton>
            </>
          }
      />
    <Box
      width={boxWidth}
      margin="0 auto"
      flex={3}
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
              <UserForm 
                data={dataGet} inputWidth={inputWidth}/>
            </TabPanel>
            <TabPanel>
              <PassForm 
                data={dataGet} inputWidth={inputWidth}/>
            </TabPanel>
            <TabPanel>
              <DeleteForm 
                data={dataGet} inputWidth={inputWidth}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
    </Flex>
  );
}

interface FormProps {
  inputWidth?: string,
  data?: IGetUser
}

function UserForm({
  inputWidth,
  data,
}: FormProps) {
  let [success, setSuccess] = useState(false);
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    clearErrors,
    register,
    setValue,
  } = useForm<IEditUser>();

  useEffect (() => {
    if (data) {
      setValue("firstName", data.firstName || "")
      setValue("lastName", data.lastName || "")
      setValue("driversLicense", data.driversLicense || "")
      setValue("phoneNo", data.phoneNo || "")
    }
  }, [data])

  const { trigger: updateTrigger } = useSWRMutation(
    swrKeys.profileUser,
    CustomPut<IEditUser>,
    {
      onSuccess: () => {
        setSuccess(true);
        console.log('Saved changes');
      },
      onError: () => {
        console.log('Something went wrong!');
      },
    }
  );

  const onUpdateProfile = async (input: IEditUser) => {
    clearErrors();
    await updateTrigger(input);
  };

  return success ? 
    <SuccessWindow 
      title='Changes Saved Successfully!'
      text="You may now close this page"
      returnPage={{name: "Back to My Profile", link: "/myProfile"}} 
    /> : (
      <chakra.form onSubmit={handleSubmit(onUpdateProfile)}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          wrap="nowrap"
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
              defaultValue={data?.firstName}
              placeholder="Enter your first name"
              error={errors.firstName?.message}
            />
            <CustomInput
              {...register('lastName', {
                required: 'Must enter your last name',
              })}
              label="Last name"
              type="text"
              defaultValue={data?.lastName}
              placeholder="Enter your last name"
              error={errors.lastName?.message}
            />
            <CustomInput
              {...register('driversLicense', {
                required: "Driver's license is required",
              })}
              label="Driver's license"
              type="text"
              defaultValue={data?.driversLicense}
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
              defaultValue={data?.phoneNo}
              placeholder="Enter your phone number"
              error={errors.phoneNo?.message}
            />
            <CustomInput
            {...register('password', {
                required: 'Must enter password',
              })}
              label="Enter password"
              type="password"
              placeholder="password"
              error={errors.password?.message}
            />
          </VStack>
        </Flex>
        {/* Buttons */}
        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          gap={4}
          mt={6}
          justify="center"
          align="center"
        >
          <SupportButton
            mt={8}
            href="/myProfile"
            w={{ base: '100%', md: '30%' }}
          >
            Cancel
          </SupportButton>
          <SubmitButton
            mt={8}
            label="Save changes"
            submittingLabel="Trying to save..."
            isSubmitting={isSubmitting}
            w={{ base: '100%', md: '30%' }}
          />
        </Flex>
      </chakra.form>
    )
}

function PassForm ({
}:FormProps) {
  let [success, setSuccess] = useState(false);
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
    getValues,
    register,
  } = useForm<IEditPassword>();

  const { trigger: passTrigger } = useSWRMutation(
    swrKeys.userPass,
    CustomPut<{newPassword: string, oldPassword: string}>,
    {
      onSuccess: () => {
        setSuccess(true);
        
        console.log('Saved changes');
      },
      onError: () => {
        console.log('Something went wrong!');
      },
    }
  );

  const onResetPassword = async (input: IEditPassword) => {
    if (input.password.length < 8) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters',
      });
      return;
    }
    if (input.password !== input.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    clearErrors();
    await passTrigger(
      {
        newPassword: input.password, 
        oldPassword: input.oldPassword
      });
  };

  return success ? 
    <SuccessWindow 
      title='Password Changed Successfully!'
      text="You may now close this page"
      returnPage={{name: "Back to My Profile", link: "/myProfile"}} 
    /> : (
      <chakra.form onSubmit={handleSubmit(onResetPassword)}>
        <VStack spacing={4}>
          <CustomInput
            {...register('oldPassword', {
              required: 'Must enter old password',
            })}
            label="Current Password"
            type="password"
            placeholder="Enter your old password"
            error={errors.oldPassword?.message}
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
                value === getValues('password') ||
                'Passwords do not match',
            })}
            label="Confirm New password"
            type="password"
            placeholder="Repeat new password"
            error={errors.confirmPassword?.message}
          />
          <Flex
            direction={{ base: 'column-reverse', md: 'row' }}
            gap={4}
            mt={6}
            justify="center"
            align="center"
            width={"100%"}
          >
          <SupportButton
              mt={4}
              href="/myProfile"
              w={{ base: '100%', md: '30%' }}
            >
              Cancel
            </SupportButton>
            <SubmitButton
              mt={4}
              alignSelf={'flex-start'}
              label="Reset Password"
              submittingLabel="Trying to reset..."
              isSubmitting={isSubmitting}
              w={{ base: '100%', md: '30%' }}
            />
          </Flex>
        </VStack>
      </chakra.form>
    )
}

function DeleteForm ({
}:FormProps) {
  return (
  <>
    <Flex direction={'column'} align={'center'} width={'100%'}>
      <Box
        width={'100%'}
        my={2}
        color="brandblack"
        fontWeight={500}
        borderLeftWidth={4}
        borderColor="gray.400"
        bg="gray.100"
        p={4}
      >
        <cite>{`"Understand this: things are now in motion that cannot be undone."`}</cite>
      </Box>
      <Box textAlign={'right'} width={'80%'}>
        - <cite>Gandalf the Gray</cite>
      </Box>
    </Flex>
    <Flex direction={{base: "column-reverse", md: "row"}} justify={"space-between"} mt={10} gap={4}>
      <SupportButton
        mt="2px"
        href="/myProfile"
        w={{ base: '100%', md: '30%' }}
      >
        Cancel
      </SupportButton>
      <DeleteButton
        label="Delete Account"
      />
    </Flex>
  </>
  )
}