"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import CustomMap from "@/components/shared/Map/CustomMap/CustomMap";
import { dealershipLocations } from "@/mockData/mockLocations";
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
        <Flex w="100%" justifyContent="space-evenly" bg="brandwhite">
            <Flex direction="column" maxW="30%" gap="10px">
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
            <Flex direction="column" pt="20px" gap="5px" w="50%" minWidth="500px">
                <Heading size="lg" color="brandblack" alignSelf="flex-start" m="0 0 10px 20px">
                    Your locations:
                </Heading>
                <CustomMap locations={dealershipLocations} showInfoWindow={true} />
                <Flex direction="column" ml="10px">
                    <Text fontWeight="bold" paddingBlock="5px">
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
        </Flex>
    )
}