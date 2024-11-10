import ChooseRegisterType from '@/components/shared/auth/ChooseRegisterType';
import { Flex } from '@chakra-ui/react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ChooseRegisterType />
      {children}
    </>
  );
}
