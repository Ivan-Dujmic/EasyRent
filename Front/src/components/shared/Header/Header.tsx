import { Box, Button, Flex, Text, BoxProps, FlexProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AnimatedSignUp } from '../auth/AnimatedSignUp/AnimatedSignUp';
import EasyRentLogo from '@/components/core/EasyRentLogo/EasyRentLogo';

interface HeaderProps extends BoxProps, FlexProps {
}

export const CustomHeader: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  children,
  bg = "brandwhite",
  boxShadow = "md",
  color = "brandblack",
  fontSize = "sm",
  zIndex = 2,
  gap = 4,
  align = "baseline",
  justify = "flex-end",
  maxW = "1200px",
  mx = "auto",
  px = 6,
  py = 4,
  ...rest
}) => {
  return (
    <Box bg={bg} boxShadow={boxShadow} color={color} fontSize={fontSize} zIndex={zIndex}>
      <Flex justify={'space-between'} align={'center'} maxW={maxW} mx={mx} px={px} py={py}>
        {/* Logo */}
        <EasyRentLogo />
        <Flex gap={gap} align={align} justify={justify} {...rest}>
          {children} 
        </Flex>
      </Flex>
    </Box>
  );
};

export default function Header() {
  return (
    <CustomHeader>
      <Text
        as={NextLink}
        href="/login"
        color={'brandblack'}
        fontWeight={'semibold'}
      >
        Login
      </Text>

      {/* Small vertical line */}
      <Box height="4" borderLeft="1px" borderColor="brandgray" />

      <AnimatedSignUp />

      <Button
        bg={'brandblue'}
        color={'brandwhite'}
        fontWeight={'normal'}
        fontSize="sm"
        size="sm"
        _hover={{
          bg: 'brandblue',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        }}
      >
        Talk to us
      </Button>
    </CustomHeader>
  );
}
