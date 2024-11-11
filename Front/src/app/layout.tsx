import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Flex } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EasyRent',
  description: 'Application for rent-a-car',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Flex bg={'brandwhite'} color="brandblack" minHeight={'100vh'}>
            {children}
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
