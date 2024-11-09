'use client';

import { easyRentLightTheme } from '@/styles/theme/easy-rent-light-theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SWRConfig } from 'swr';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig>
      <ChakraProvider theme={easyRentLightTheme}>{children}</ChakraProvider>
    </SWRConfig>
  );
}
