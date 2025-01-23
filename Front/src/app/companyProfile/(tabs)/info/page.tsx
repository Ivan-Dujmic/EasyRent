"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import CustomMap from "@/components/shared/Map/CustomMap/CustomMap";
import { useUserContext } from "@/context/UserContext/UserContext";
import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { dealershipLocations } from "@/mockData/mockLocations";
import { ICompanyInfo } from "@/typings/company/company";
import { ExtraLocationInfo, ILocation, ILocationDetails } from "@/typings/locations/locations";
import { IRentalEntry } from "@/typings/vehicles/vehicles.type";
import { EditIcon } from "@chakra-ui/icons";
import { Flex, Heading, Text, Image, Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import useSWR from "swr";

export default function CompanyProfileInfo() {
    const { data: info } = useSWR(swrKeys.companyInfo, CustomGet<ICompanyInfo>);
    const { data: locations } = useSWR(swrKeys.companyLocations, CustomGet<ILocation[]>);
    const {data : locationDetalis} = useSWR(
        locations ? locations.map((location) => swrKeys.companyLocationInfo +  `${location.locationId}`) : null,
        (urls) => Promise.all(urls.map(url => CustomGet<ILocationDetails>(url)))
      );
    const { user } = useUserContext();

    if (!locationDetalis) return <div>Loading...</div>;

    const mapLocations = locationDetalis.map((location, indx) => ({
    streetName: location.streetName,
    streetNo: location.streetNo,
    cityName: location.cityName,
    location_id: indx,
    id : indx,
    dealership_id: 1,
    name : location.cityName,
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    address : `${location.streetName} ${location.streetNo}, ${location.cityName}`,
    availableCars: Math.floor(Math.random() * 11),
    workingHours: 'Mon-Fri: 8 AM - 4 PM',
    }));

    return(
        <Flex w="100%" justifyContent="space-evenly" bg="brandwhite">
            <Flex direction="column" maxW="30%" gap="10px">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading ml="40px">
                        {user.firstName}
                    </Heading>
                    <Box mr="40px">
                        <Image src={info?.image} alt="company_logo"/>
                    </Box>
                </Flex>
                <Text m="10px">
                {info?.description}
                </Text>
                <SupportButton href={`/profile/${user.firstName}/edit`} m="5px" maxWidth="180px">
                    <EditIcon marginRight="10px"/>
                    Edit profile
                </SupportButton>
            </Flex>
            <Flex direction="column" pt="20px" gap="5px" w="50%" minWidth="500px">
                <Heading size="lg" color="brandblack" alignSelf="flex-start" m="0 0 10px 20px">
                    Your locations:
                </Heading>
                <CustomMap locations={mapLocations} showInfoWindow={true} />
                <Flex direction="column" ml="10px">
                    <Text fontWeight="bold" paddingBlock="5px">
                        Zagrebačka avenija 3, Zagreb
                    </Text>
                    <Flex direction="column" justifyContent="flex-start" gap="2px">
                        {mapLocations.map((location, indx) => (
                            <Text key={indx}>
                                {location.address}
                            </Text>
                        )
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}