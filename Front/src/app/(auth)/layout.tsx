import HeaderAuth from '@/components/shared/Header/HeaderAuth';
import { Flex } from '@chakra-ui/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Flex direction="column" grow={1} bg={'brandlightgray'}>
        <HeaderAuth />
        {children}
      </Flex>
    </>
  );
}
