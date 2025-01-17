"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import VehicleList from "@/components/shared/cars/VechileList/VechileList";
import VehicleCard from "@/components/shared/cars/VehicleCard/VechileCard";
import CustomMap from "@/components/shared/Map/CustomMap/CustomMap";
import { dealershipLocations } from "@/mockData/mockLocations";
import { EditIcon } from "@chakra-ui/icons";
import { Flex, Heading, Text, Image, Box, VStack, Grid, Container } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { mockVehicles0 } from "@/mockData/mockVehicles"
import AuthUserHeader from "@/components/shared/Header/AuthUserHeader/AuthUserHeader";
import Header from "@/components/shared/Header/HeaderAuth";
import EasyRentLogo from "@/components/core/EasyRentLogo/EasyRentLogo";
const data = {
    company: "myCompany"
}
export interface User {
    role: string; // "guest", "user", "company", "admin"
    firstName?: string;
    lastName?: string;
    companyName?: string;
    balance?: number;
  }

const user = {
    role: "guest"
}
const adresses = ["Savska ulica 14, Zagreb",
    "Unska ulica 1, Zagreb",
    "Ulica grada Vukovara 59, Zagreb"]

export default function CompanyPage() {
    
    return(
    <VStack w="100%" gap="20px" alignItems="center" justifyContent="start">
        {user.role === 'user' && <AuthUserHeader UserData={user} />}
        {user.role !== 'user' && (    
            <Box bg="white" boxShadow={'sm'} color={'black'} fontSize="sm" w="100%">
              <Flex align="center" maxW="1200px" mx="auto" px={6} py={4}>
                {/* Logo */}
                <EasyRentLogo />
              </Flex>
            </Box>
        )}
        <Flex w="100%" justifyContent="space-evenly" bg="brandwhite">
            <Flex direction="column" maxW="30%" gap="10px">
                <Flex justifyContent="space-between" alignItems="center">
                    <Flex direction="column" ml="40px" gap="5px">
                        <Heading >
                            {data.company}
                        </Heading>
                        <Text>{adresses[0]}</Text>
                    </Flex>
                    <Box
                        mr="40px"
                    >company logo</Box>
                </Flex>
                <Text m="10px">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper. Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper. Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper. Lorem ipsum odor amet, consectetuer adipiscing elit. Egestas interdum dolor blandit vivamus convallis pellentesque. Massa justo volutpat interdum congue placerat semper.
                </Text>
            </Flex>
            <Flex direction="column" pt="20px" gap="5px" w="50%" minWidth="500px">
                <Heading size="lg" color="brandblack" alignSelf="flex-start" m="0 0 10px 20px">
                    Your locations:
                </Heading>
                <CustomMap locations={dealershipLocations} showInfoWindow={true} />
            </Flex>
        </Flex>
        <Container maxW="container.2xl" px={20}>
            <Grid
              templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              gap={6} w="100%"
              justifyContent="center"
              alignItems="center" 
            >
              {mockVehicles0.map((vehicle, indx) =>(
                  <VehicleCard index={indx} vehicle={vehicle}/>
              ))
              }
            </Grid>
        </Container>
    </VStack>
    )
}