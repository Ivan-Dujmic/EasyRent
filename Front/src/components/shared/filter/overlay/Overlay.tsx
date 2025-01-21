import { ModalOverlay } from "@chakra-ui/react";

export function Overlay () 
{
    return <ModalOverlay 
        bg='blackAlpha.300'
        backdropFilter='blur(10px)'
    />
}