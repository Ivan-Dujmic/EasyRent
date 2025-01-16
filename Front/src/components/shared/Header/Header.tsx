'use client';

import {
    Text,
    Button,
    ButtonProps,
    Box
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { AnimatedSignUp } from '../auth/AnimatedSignUp/AnimatedSignUp';
import CustomHeader from './CustomHeader/CustomHeader';
import LogOutButton from '../auth/LogOutButton/LogOutButton';

interface HeaderButtonProps extends ButtonProps {
    href?: string
}

export function HeaderButton({
    children,
    href = "",
    size = "sm",
    fontSize = "sm"
}: HeaderButtonProps) {
    return <Button
        as={NextLink}
        bg={'brandblue'}
        color={'brandwhite'}
        fontWeight={'normal'}
        fontSize={fontSize}
        size={size}
        _hover={{
            bg: 'brandblue',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        }}
        href={href}
    >
        {children}
    </Button>
}

interface LoginProps {
    log?: "in" | "out"
}

export function LoginButton({
    log = "in"
}: LoginProps) {
    return <Text
        as={NextLink}
        href={log == "in" ? "/login" : "/logout"}
        color={'brandblack'}
        fontWeight={'semibold'}
        _hover={{
            textDecoration: "underline",
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        }}
    >
        {log == "in" ? "Login" : "Logout"}
    </Text>
}

export default function Header() {
    return <CustomHeader
        HeaderItems={ // For larger screens
            <>
                <LoginButton />

                {/* Small vertical line */}
                <Box height="4" borderLeft="1px" borderColor="brandgray" />

                <AnimatedSignUp />

                <HeaderButton href="/TalkToUs"> Talk to us </HeaderButton>
            </>}
        MenuItems={ // For smaller screens
            <>
                <LoginButton />
                <LogOutButton />
                <AnimatedSignUp />

                <HeaderButton href="/TalkToUs"> Talk to us </HeaderButton>

            </>}
    />;
}
