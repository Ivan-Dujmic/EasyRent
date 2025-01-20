import { extendTheme } from '@chakra-ui/react';
import { colors } from './foundations/colors';
import breakpoints from './foundations/breakpoints';

export const easyRentLightTheme = extendTheme({
  colors,
  breakpoints, // Dodavanje breakpointa u temu
});
