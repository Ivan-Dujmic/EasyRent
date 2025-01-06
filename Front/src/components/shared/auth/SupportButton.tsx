"use client"

import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface ISuppButton extends ButtonProps {
    children : React.ReactNode,
    href : string
}

export default function SupportButton ({children, href, ...props}: ISuppButton){
    return (
        <Button 
        as="a" 
        bg = "brandlightgray"
        borderRadius="md"
        p="5"

        href={href} 
        {...props}
        >
        {children}
        </Button>
    )
}