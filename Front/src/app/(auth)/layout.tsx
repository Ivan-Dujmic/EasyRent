import { AuthRedirect } from '@/components/shared/auth/AuthRedirect/AuthRedirect';
import HeaderAuth from '@/components/shared/Header/HeaderAuth';
import { Flex } from '@chakra-ui/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthRedirect to={''} condition={'isLoggedIn'} />
      <Flex direction="column" grow={1} bg={'brandlightgray'}>
        <HeaderAuth />
        {children}
      </Flex>
    </>
  );
}
