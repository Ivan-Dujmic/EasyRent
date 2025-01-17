'use client';

import { FaComments } from 'react-icons/fa';
import React from 'react';
import {
  Flex,
  IconButton,
  Heading,
  Button,
  VStack,
  Divider,
  useBreakpointValue,
  PositionProps,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import ChatbotWidget from '@/components/shared/ChatbotWidget/ChatbotWidget';
import { CloseIcon } from '@chakra-ui/icons';


export function ChatIcon ({
onClick,
...rest
}:ChatIconProps) {
    return <IconButton
        aria-label="Open chat"
        icon={<FaComments />}
        onClick={onClick}
        isRound
        size="lg"
        bg="brandblue"
        color="brandwhite"
        _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        {...rest}
    />
}

interface ChatIconProps extends PositionProps {
    onClick: () => void
}

function ChatButton ({
    name
}:IChat, key : number) {
    return <Button
        key={key}
        size="sm"
        variant="outline"
        color="brandblue"
        justifyContent="flex-start"
        _hover={{ bg: 'brandlightgray' }}
    >{name}</Button>
}

interface ChatMenuProps {
    onClose: () => void,
    isOpen: boolean,
    chats?: IChat[]
}

export default function ChatMenu({ 
    onClose,
    isOpen,
    chats = []
    }:ChatMenuProps ) {
    const gapSize = useBreakpointValue({
        base: 8, // Small gap for small screens (mobile)
        md: 10, // Slightly larger gap for medium screens (laptop/tablet)
        lg: 10, // Largest gap for large screens (desktop)
        xl: 10,
    });

    const screenSize = useBreakpointValue({ base: 'small', lg: 'large' });

    let content = chats.map((props, index) => ChatButton(props, index))

    return screenSize == "large" ? (
        <Flex
        direction="column"
        width="25%"
        bg="brandwhite"
        boxShadow="base"
        borderRadius="md"
        p={gapSize}
        gap={gapSize}
        >
        <Heading size="md" color="brandblue">
            Chats
        </Heading>
        <Divider />
        <VStack align="stretch" spacing={3}>
            {content}
        </VStack>
        <Button
            onClick={onClose}
            mt={3}
            size="sm"
            variant="solid"
            bg="brandblue"
            color="brandwhite"
            _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        >
            Close
        </Button>
        <ChatbotWidget />
        </Flex>
        ) : (
        <>
            <Drawer isOpen={isOpen} onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>
                <Flex justify="space-between" align="center">
                    <Heading size="md" color="brandblue">
                    Chats
                    </Heading>
                    <IconButton
                    aria-label="Close Chat"
                    icon={<CloseIcon />}
                    variant="ghost"
                    onClick={onClose}
                    />
                </Flex>
                </DrawerHeader>
                <Divider />
                <DrawerBody>
                <VStack align="stretch" spacing={4}>
                    {content}
                </VStack>
                </DrawerBody>
            </DrawerContent>
            </Drawer>
        </>
    );
}