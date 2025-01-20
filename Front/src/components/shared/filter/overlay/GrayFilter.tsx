import { Box, BoxProps } from "@chakra-ui/react"

interface GrayFilterProps extends BoxProps {
    show: boolean
}

export default function GrayFilter({
    show,
    children,
    opacity = 0.4,
    ...rest
}:GrayFilterProps) {
    return <Box
            display={show ? "flex" : "none"}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bg={`rgba(0, 0, 0, ${opacity})`}
            color="white"
            alignItems="center"
            justifyContent="center"
            opacity={1}
            transition="all 0.3s ease"
            {...rest}>
            {children}
        </Box>
}