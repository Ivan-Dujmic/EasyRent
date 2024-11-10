"use client"

import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export default function ChooseRegisterType() {
    const pathname = usePathname();

    const getBgColor = (pathname: string) => {
        switch (pathname) {
          case '/register/user':
            return { 
                first: {
                    txt: 'white',
                    light: 'blue', dark: 'teal.600'
                }, 
                second: {
                    txt: 'black',
                    light: 'lightgray', dark: 'teal.600'
                }};
          case '/register/company':
            return { 
                first: {
                    txt: 'black',
                    light: 'lightgray', dark: 'teal.600'
                }, 
                second: {
                    txt: 'white',
                    light: 'blue', dark: 'teal.600'
                }};        
          default:
            return {
                first: {
                    txt: 'white',
                    light: 'blue', dark: 'teal.600'
                }, 
                second: {
                    txt: 'black',
                    light: 'lightgray', dark: 'teal.600'
                }};
        }
      };

    const colors = getBgColor(pathname);
    const bgColor = {
        first: useColorModeValue(colors.first.light, colors.first.light),
        second: useColorModeValue(colors.second.light, colors.second.dark)
    }

    const common = {
        p:"10px",
        m:"10px",
        borderRadius:"10px"
    }
  return (
    <Flex direction="row" alignItems="center" justifyContent="center"
    p="20px">
        <Text
        sx={common}
        >
        Register</Text>
        <Box
        bg={bgColor.first}
        color={colors.first.txt}
        sx={common}
        as='a'
        href='/register/user'
        >User</Box>

        {/*vertical line */}
        <Box height="10" borderLeft="1px" borderColor="gray" />

        <Box
        bg={bgColor.second}
        sx={common}
        color={colors.second.txt}
        as='a'
        href='/register/company'

        >Company</Box>


    </Flex>
  )
}
