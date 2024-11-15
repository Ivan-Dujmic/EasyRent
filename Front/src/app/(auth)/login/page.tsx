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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ILogIn } from '@/typings/logIn/logIn.type';

import useSWRMutation from 'swr/mutation';
import { swrKeys } from '@/fetchers/swrKeys';
import { logIn } from '@/mutation/login';
import { useRouter } from 'next/navigation';
import SucessLoginWindow from '@/components/shared/SuccessWidnow/SucessLoginWindow';

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


	const suppButtons = {
		bg: 'brandlightgray',
		p: 5,
		m: 5,
		BorderRadius: 'md',
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
					<FormControl isRequired isInvalid={!!errors.email}>
						<FormLabel>Email</FormLabel>
						<Input
							{...register('email', {
								required: 'Email is required',
							})}
							type="email"
							placeholder="Enter your email"
						/>
						{errors.email && (
							<FormErrorMessage color={'red'}>
								{errors.email.message}
							</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isRequired isInvalid={!!errors.password}>
						<FormLabel>Password</FormLabel>
						<Input
							{...register('password', {
								required: 'Must enter password',
							})}
							type="password"
							placeholder="Enter your password"
						/>
						{errors.password && (
							<FormErrorMessage color={'red'}>
								{errors.password.message}
							</FormErrorMessage>
						)}
					</FormControl>
					<Flex
						direction={'row'}
						justifyContent={'space-evenly'}
						alignItems={'center'}
						w={'full'}
					>
						<Button
							type="submit"
							p={5}
							borderRadius="md"
							bg="brandblue"
							m="5"
							color={'brandwhite'}
							disabled={isSubmitting}
							border="2px solid"
							borderColor={'brandwhite'}
							_hover={{
								bg: 'brandmiddlegray',
								color: 'brandblack',
								borderColor: 'brandblue',
								transition: 'all 0.3s ease', // Animacija prijelaza
							}}
						>
							{isSubmitting ? 'Logging in...' : 'Login'}
						</Button>
						<Spacer />
						<Button as="a" href="/register/user" sx={suppButtons}>
							Register
						</Button>
						<Button as="a" href="/home" sx={suppButtons}>
							Continue as guest
						</Button>
						<Button as="a" href="https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=46779697704-6adjgimqe4r002oadcr0qa9473k1l573.apps.googleusercontent.com&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Faccounts%2Fgoogle%2Flogin%2Fcallback%2F&scope=email%20profile&response_type=code&state=Gv1o9aCPb0mBm0gl&access_type=online&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow" sx={suppButtons}>
							Sign in with Google
						</Button>

					</Flex>
				</VStack>
			</chakra.form>
		</Box>
	);
}
