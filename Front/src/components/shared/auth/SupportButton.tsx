"use client"

import { Button, ButtonProps } from "@chakra-ui/react";

interface ISuppButton extends ButtonProps {
    label : string,
    p : string,
    m : string,
    href : string
}

export default function SupportButton ({label, p, m, href, ...rest}: ISuppButton){
    return (
        <Button 
        as="a" 
        bg = "brandlightgray"
        borderRadius="md"

        p={p}
        m={m}
        href={href} 
        >
        {label}
        </Button>
    )
}