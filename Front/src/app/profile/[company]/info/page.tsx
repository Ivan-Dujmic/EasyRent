"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import { EditIcon } from "@chakra-ui/icons";
import { Flex, Heading, Text, Image, Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function CompanyProfileInfo() {
    
    const pathname = usePathname();
    const company = pathname.split('/').filter(Boolean).at(-2);
    const adresses = ["Savska ulica 14, Zagreb",
        "Unska ulica 1, Zagreb",
        "Ulica grada Vukovara 59, Zagreb"]
    return(
        <Flex w="100%" justifyContent="space-evenly" mt="20px" bg="brandwhite">
            <Flex direction="column" maxW="50%" gap="10px">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading ml="40px">
                        {company}
                    </Heading>
                    <Box
                        mr="40px"
                    >company logo</Box>
                </Flex>
                <Text m="10px">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper. Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper. Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper. Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper.
                </Text>
                <SupportButton href={`/profile/${company}/edit`} m="5px" maxWidth="180px">
                    <EditIcon marginRight="10px"/>
                    Edit profile
                </SupportButton>
            </Flex>
            <Flex direction="column" p="20px">
                <Text fontWeight="bold">
                    Zagrebačka avenija 3, Zagreb
                </Text>
                <Flex direction="column" justifyContent="flex-start" gap="2px">
                    {adresses.map((adress, indx) => (
                        <Text key={indx}>
                            {adress}
                        </Text>
                    )
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}