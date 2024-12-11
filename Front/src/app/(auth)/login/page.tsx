'use client';

import {
	chakra,
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Heading,
	VStack,
	Flex,
	Spacer,
	FormErrorMessage,
	Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
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

export default function HomePage() {
	const [loggedIn, setLoggedIn] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
		setError,
		clearErrors,
		getValues,
	} = useForm<ILogIn>();
	const router = useRouter();

	const { trigger } = useSWRMutation(swrKeys.logIn, logIn, {
		onSuccess: (data) => {
			setLoggedIn(true);
			if (data?.role == 'user') router.push('/YourHomePage');
			else if (data?.role == 'company') router.push('/CompanyHomePage');
		},
		onError: () => {
			setError('email', {
				type: 'manual',
				message: 'This email is not registered',
			});
		},
	});

	const onLogIn = async (data: ILogIn) => {
		clearErrors();
		console.log('On register:', data);
		await trigger(data);
		console.log(data);
	};

	return loggedIn ? (
		<SucessLoginWindow />
	) : (
		<Box
			minWidth="400px"
			maxW="800px"
			w="80vw"
			margin="0 auto"
			mt="10"
			p="6"
			boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
			borderRadius="md"
			bg="brandwhite"
		>
			<Heading as="h2" size="lg" mb="6">
				Login
			</Heading>
			<chakra.form onSubmit={handleSubmit(onLogIn)}>
				<VStack spacing="4">
					<CustomInput
						{...register('email', {
							required: 'Email is required',
						})}
						label = "Email"
						type="email"
						placeholder="Enter your email"
						error={errors.email?.message}
					/> 
					<CustomInput
						{...register('password', {
							required: 'Must enter password',
						})}
						label = "Password"
						type="password"
						placeholder="Enter your password"
						error={errors.password?.message}
					/>
					<Flex
						direction={'row'}
						justifyContent={'space-evenly'}
						alignItems={'center'}
						w={'full'}
					>
						<SubmitButton 
						label='Login'
						submittingLabel='Logging in...'
						p = "5"
						m = "5"
						isSubmitting={isSubmitting}
						/>
						<Spacer />
						<SupportButton
						label='Register'
						href="/register/user"
						p = "5"
						m = "5"
						/> 
						<SupportButton
						label='Continue as guest'
						href="/home"
						p = "5"
						m = "5"
						/> 
						<Button
							as="a"
							href="https://easyrent-t7he.onrender.com/accounts/google/login/?next=/"
							bg="brandlightgray"
							borderRadius="md"
							p = "5"
							m = "5"
						>
							<Flex justify={'space-between'} align={'center'} gap={2}>
								<FcGoogle />
								<Text>Sign in with Google</Text>
							</Flex>
						</Button>
					</Flex>
				</VStack>
			</chakra.form>
		</Box>
	);
}
