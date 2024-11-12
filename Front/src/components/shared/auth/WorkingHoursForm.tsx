import { Box, Text, Flex, useColorModeValue, Heading, transition, VStack,FormControl, Input } from '@chakra-ui/react';

export default function WorkingHoursForm() {
    const margins = {m:2}
  return (
    <VStack width={"full"} gap={0} alignItems={'end'}>
        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Mon
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>

        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Tue
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>

        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Wed
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>

        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Thu
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>

        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Fri
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>

        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Sat
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>

        <Flex justifyContent={"space-evenly"} alignItems={"center"} width={"full"}>
            <Text  textAlign={"center"} sx={margins}>
                Sun
            </Text>
            <Input
                type='time'
                sx={margins}
            />
            <Input
                type='time'
                sx={margins}
            />
        </Flex>
    </VStack>
  )
}
