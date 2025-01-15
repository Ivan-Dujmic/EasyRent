'use client';

import { easyRentLightTheme } from '@/styles/theme/easy-rent-light-theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import { CarProvider } from '@/context/CarContext'; // Dodajte vaš CarProvider
import { UserProvider } from '@/context/UserContext/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig>
      <ChakraProvider theme={easyRentLightTheme}>
        <UserProvider>
          <CarProvider>
            {' '}
            {/* Wrapanje aplikacije sa CarProvider */}
            {children}
          </CarProvider>
        </UserProvider>
      </ChakraProvider>
    </SWRConfig>
  );
}
