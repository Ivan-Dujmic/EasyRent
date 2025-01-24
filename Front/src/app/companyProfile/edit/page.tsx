'use client';

import CustomInput from '@/components/shared/auth/CustomInput';
import SubmitButton from '@/components/shared/auth/SubmitButton';
import SupportButton from '@/components/shared/auth/SupportButton';
import SuccessWindow from '@/components/shared/SuccessWidnow/SuccessWidnow';
import { swrKeys } from '@/fetchers/swrKeys';
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
  Input,
  Button,
  Image,
} from '@chakra-ui/react';
import { ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import DeleteButton from '@/components/shared/auth/DeleteButton/DeleteButton';
import { CustomGet } from '@/fetchers/get';
import useSWR, { mutate } from 'swr';
import { CustomPut } from '@/fetchers/post';
import { ICompanyInfo, IEditInfo, IEditPassword, ISetHQ } from '@/typings/company/company';
import { AdressElem } from '@/components/shared/profile/company/AdressElem';
import { ILocation } from '@/typings/locations/locations';
import { CustomDelete } from '@/fetchers/delete';

interface IPasswords {
  password: string; // Lozinka korisnika
  confirmPassword: string; // Potvrda lozinke
  oldPassword: string; // Stara lozinka
}

export default function EditPage() {
  const {
    handleSubmit: handleUser,
    formState: { isSubmitting: isSubUser, errors: errUser },
    clearErrors: clearErrUser,
    register: registerUser,
    setValue: setValueUser,
  } = useForm<IEditInfo>();

  const {
    handleSubmit: handlePass,
    formState: { isSubmitting: isSubPass, errors: errPass },
    setError: setErrPass,
    clearErrors: clearErrPass,
    getValues: getValPass,
    register: registerPass,
  } = useForm<IPasswords>();

  const {
    handleSubmit: handleHQ,
    formState: { isSubmitting: isSubHQ, errors: errHQ },
    setError: setErrHQ,
    clearErrors: clearErrHQ,
    getValues: getValHQ,
    register: registerHQ,
  } = useForm<ISetHQ>();

  let [success, setSuccess] = useState(false);
  const { data: companyInfo } = useSWR(swrKeys.companyInfo, CustomGet<ICompanyInfo>);
  const { data: locationsData } = useSWR(swrKeys.companyLocations, CustomGet<any>);
  const locations = locationsData?.results as ILocation[];

  const [preview, setPreview] = useState(companyInfo?.image);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setValueUser('logo', reader.result as string); // Store in React Hook Form
        setPreview(reader.result as string); // Show preview
      };
    }
  };

  const handleAddressDel = async (id : number) => {
    try {
        CustomDelete<void>(swrKeys.companyLocationInfo + id)
        mutate(swrKeys.companyLocations); // Re-fetch the data from the server        
      } catch (error) {
        console.error('Delete failed', error);
      }
};

  const { trigger: updateTrigger } = useSWRMutation(
    swrKeys.companyInfo,
    CustomPut<IEditInfo>,
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

  const { trigger: passTrigger } = useSWRMutation(
    swrKeys.companySetPass,
    CustomPut<IEditPassword>,
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

  const onUpdateProfile = async (data: IEditInfo) => {
    clearErrUser();
    await updateTrigger(data);
  };

  const onResetPassword = async (data: IPasswords) => {
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
    await passTrigger({
      oldPassword : data.oldPassword,
      newPassword : data.password
    });
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
  if (!companyInfo || !locations) return <div>Loading...</div>

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
            <Tab>Company Information</Tab>
            <Tab>Password</Tab>
            <Tab>Locations</Tab>
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
                    <Flex justifyContent="space-between" alignItems="center" w="100%">
                      <Input
                        type="file"
                        accept="image/*"
                        hidden
                        required
                        id="fileInput"
                        {...registerUser("logo")}
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
                          <Image src={preview} h="50px" alt="slika logo"/>
                        </Box>
                      )}
                    </Flex>
                    <CustomInput
                      {...registerUser('name', {
                        required: 'Must enter company name',
                      })}
                      label="Company name"
                      type="text"
                      defaultValue={companyInfo?.companyName}
                      placeholder="Enter company name"
                      error={errUser.name?.message}
                    />
                    <CustomInput
                      {...registerUser('phoneNo', {
                        required: 'Must enter phone number',
                      })}
                      label="Phone number"
                      type="tel"
                      defaultValue={companyInfo?.phoneNo}
                      placeholder="Enter company phone number"
                      error={errUser.phoneNo?.message}
                    />
                  </VStack>
                  <VStack spacing={4} w={inputWidth}>
                    <CustomInput
                      {...registerUser('description', {
                        required: "Company description is required",
                      })}
                      label="Description"
                      type="text"
                      defaultValue={companyInfo?.description}
                      placeholder="Enter company description"
                      error={errUser.description?.message}
                      h="30vh"
                      as="textarea"
                      p="10px"
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
                  <SupportButton
                    href="/companyProfile/info"
                    w={{ base: '100%', md: '30%' }}
                  >
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
                      required: 'Must enter old password',
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
                        value === getValPass('password') ||
                        'Passwords do not match',
                    })}
                    label="Confirm New password"
                    type="password"
                    placeholder="Repeat new password"
                    error={errPass.confirmPassword?.message}
                  />
                  <SubmitButton
                    mt={4}
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
                <SupportButton href='/location' m="15px" >Add location</SupportButton>
                <VStack gap="5">
                  <AdressElem adress={locations[0]} HQ onConfirm={handleAddressDel}/>
                  {locations.slice(1).map((location, indx) => (
                    <AdressElem adress={location} key={indx} onConfirm={handleAddressDel}/>
                  ))}
                </VStack>
            </TabPanel>
            <TabPanel>
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
              <DeleteButton
                label="Delete Account"
                mt="10"
                float={'right'}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
}
