'use client';

import { Box, Flex, BoxProps, FlexProps } from '@chakra-ui/react';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';

interface HeaderProps extends BoxProps, FlexProps {}

export const CustomHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  children,
  bg = 'brandwhite',
  boxShadow = 'md',
  color = 'brandblack',
  fontSize = 'sm',
  zIndex = 2,
  gap = 4,
  align = 'baseline',
  width = '100%',
  justify = 'flex-end',
  maxW = '1200px',
  mx = 'auto',
  px = 6,
  py = 4,
  ...rest
}) => {
  return (
    <Box
      bg={bg}
      boxShadow={boxShadow}
      color={color}
      fontSize={fontSize}
      zIndex={zIndex}
      width={width}
    >
      <Flex
        justify={'space-between'}
        align={'center'}
        maxW={maxW}
        mx={mx}
        px={px}
        py={py}
      >
        {/* Logo */}
        <EasyRentLogo />
        <Flex gap={gap} align={align} justify={justify} {...rest}>
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};

export default CustomHeader;
