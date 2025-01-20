'use client';

import { easyRentLightTheme } from '@/styles/theme/easy-rent-light-theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import { CarProvider } from '@/context/CarContext'; // Dodajte vaš CarProvider
import { UserProvider } from '@/context/UserContext/UserContext';
import { FilterProvider } from '@/context/FilterContext/FilterContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig>
      <ChakraProvider theme={easyRentLightTheme}>
        <UserProvider>
          <FilterProvider>
            <CarProvider>
              {' '}
              {/* Wrapanje aplikacije sa CarProvider */}
              {children}
            </CarProvider>
          </FilterProvider>
        </UserProvider>
      </ChakraProvider>
    </SWRConfig>
  );
}
