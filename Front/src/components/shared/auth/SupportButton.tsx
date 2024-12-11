"use client"

import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface ISuppButton extends ButtonProps {
    children : React.ReactNode,
    m : string,
    href : string
}

export default function SupportButton ({children, m, href, ...rest}: ISuppButton){
    return (
        <Button 
        as="a" 
        bg = "brandlightgray"
        borderRadius="md"
        p="5"

        m={m}
        href={href} 
        >
        {children}
        </Button>
    )
}