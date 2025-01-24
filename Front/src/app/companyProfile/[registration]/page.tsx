"use client"
import ReviewCard from "@/components/shared/cars/ReviewCard/ReviewCard";
import DynamicRows from "@/components/shared/company/CompanyList/DynamicRows";
import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { IVehicleLog, IVehicleLogs } from "@/typings/logs/logs.type";
import { ILogReview, IReview } from "@/typings/reviews/reviews.type";
import { VStack, Flex, Text, Heading, Divider, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Container, Grid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
const complatedRents = [
    { from: "2024-02-01", to: "2024-02-10", who: "John Doe", price: "€500", pickup: "New York", dropoff: "Los Angeles" },
    { from: "2024-03-15", to: "2024-03-20", who: "Jane Smith", price: "€300", pickup: "Berlin", dropoff: "Paris" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
  ];

const upcomingRents = [
    { from: "2024-02-01", to: "2024-02-10", who: "John Doe", price: "€500", pickup: "New York", dropoff: "Los Angeles" },
    { from: "2024-03-15", to: "2024-03-20", who: "Jane Smith", price: "€300", pickup: "Berlin", dropoff: "Paris" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
    { from: "2024-04-05", to: "2024-04-12", who: "Michael Brown", price: "€450", pickup: "London", dropoff: "Rome" },
  ];

interface IRent {
    fromDate: string;
    toDate: string;
    customerName: string;
    customerSurname: string;
    price: string;
    pickupAdress: string;
    dropoffAddress: string;
}

const mokData = {
    currRent : {
        fromDate: "2024-03-15",
        toDate: "2024-04-12",
        customerName: "Michael",
        customerSurname: "Brown",
        price: "€450",
        pickupAdress: "London",
        dropoffAddress: "Rome",
    },
    registration : "registration",
    modelMake : "modelMake",
    modelName : "modelName",
    address : "address",
    numRented : "numRented",
    timeRented : "timeRented",
    earnings : "earnings",
}

export default function CompanyVehiclePage () {
    const router = useRouter()
    const {id} = router.query
    const { data: vehicleLog } = useSWR(swrKeys.companyVehicleLog + id, CustomGet<IVehicleLog>);
    const { data: logUpcoming } = useSWR(swrKeys.companyVehicleLogUpcoming + id + "?limit=20&page=1", CustomGet<IVehicleLogs[]>);
    const { data: logCompleted } = useSWR(swrKeys.companyVehicleLogCompleted + id + "?limit=20&page=1", CustomGet<IVehicleLogs[]>);
    const { data: reviews } = useSWR(swrKeys.companyVehicleReviews + id, CustomGet<ILogReview[]>);
    const [tab, setTab] = useState<boolean>(false);


    function transformLogReviews(
        logReviews: ILogReview[],
      ): any {
        return logReviews?.map(logReview => ({
          image: "image",
          makeName: vehicleLog?.makeName,
          modelName: vehicleLog?.modelName,
          registration: vehicleLog?.registration,
          vehicleId: id,
          firstName: logReview.firstName,
          lastName: logReview.lastName,
          rating: logReview.ratings,
          descriptions: logReview.description,
        }));
      }
    if (!vehicleLog || !logCompleted || !logUpcoming || !reviews) return <div>Loading...</div>;


    return (
      <VStack gap={5} mt="10px"  w="100%">
            <Flex justifyContent="space-evenly" w="100%" alignItems="center">
                <VStack alignItems="start">
                    <Heading>{vehicleLog?.registration}</Heading>
                    <Text mb="5px">{vehicleLog?.makeName} {vehicleLog?.modelName}</Text>
                    <Text>{vehicleLog?.streetName} {vehicleLog?.streetNo}, {vehicleLog?.cityName}</Text>
                </VStack>
                <VStack alignItems="start">
                    <Text>Times rented: {vehicleLog?.timesRented}</Text>
                    <Text>Time rented: {vehicleLog?.rentedTime}</Text>
                    <Text>Earnings: {vehicleLog?.moneyMade}</Text>
                </VStack>
            </Flex>
            <Divider borderColor="brandgray"/>
            <TableContainer>
                <Table variant="simple">
                  {/* Table Header */}
                  <Thead bg="gray.200">
                    <Tr>
                      <Th>From</Th>
                      <Th>To</Th>
                      <Th>Customer</Th>
                      <Th>Price</Th>
                      <Th>Pickup</Th>
                      <Th>Dropoff</Th>
                    </Tr>
                  </Thead>

                  {/* Table Body */}
                  <Tbody>
                    <Tr h="10px"/>
                    {vehicleLog.onGoing && (
                    <>
                        <Tr bg="blue.300" my={10}>
                            <Td>{vehicleLog.onGoing[0].pickUpDateTime}</Td>
                            <Td>{vehicleLog.onGoing[0].dropOffDateTime}</Td>
                            <Td>{vehicleLog.onGoing[0].firstName} {vehicleLog.onGoing[0].lastName}</Td>
                            <Td>{vehicleLog.onGoing[0].price}</Td>
                            <Td>{vehicleLog.onGoing[0].pickUpLocation}</Td>
                            <Td>{vehicleLog.onGoing[0].dropOffLocation}</Td>
                        </Tr>
                        <Tr h="25px" />
                    </>
                    )}
                    <Tr>
                        <Td colSpan={6} textAlign="center">
                            <Flex justifyContent="center" gap={5}>
                                <Button onClick={() => {setTab(false)}}
                                bg={tab ? "brandlightgray" : "brandblue"}
                                color={tab ? "black" : "white"}
                                >
                                    Upcoming
                                </Button>
                                <Button onClick={() => {setTab(true)}}
                                bg={!tab ? "brandlightgray" : "brandblue"}
                                color={!tab ? "black" : "white"}
                                >
                                    Completed
                                </Button>
                            </Flex>
                        </Td>
                    </Tr>
                    {tab ? (
                        <DynamicRows n={5} data={logCompleted}/>
                    )  : (    
                        <DynamicRows n={5} data={logUpcoming}/>
                    )}
                  </Tbody>
                </Table>
            </TableContainer>
            <Divider borderColor="brandgray"/>
            <Container maxW="container.2xl" px={10}>
              <Grid
                templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                gap={6}
                justifyContent="center"
                alignItems="center" 
              >
                {transformLogReviews(reviews).map((review : IReview, indx : number) =>(
                    <ReviewCard key={indx} review={review}/>
                ))
                }
              </Grid>
            </Container>
        </VStack>

    )
}