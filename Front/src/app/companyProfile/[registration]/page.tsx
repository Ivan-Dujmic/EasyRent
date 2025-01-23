"use client"
import DynamicRows from "@/components/shared/company/CompanyList/DynamicRows";
import { VStack, Flex, Text, Heading, Divider, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from "@chakra-ui/react";
import { useState } from "react";
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
    const [tab, setTab] = useState<boolean>(false);
    return (
      <VStack gap={5} mt="10px"  w="100%">
            <Flex justifyContent="space-evenly" w="100%" alignItems="center">
                <VStack alignItems="start">
                    <Heading>{mokData.registration}</Heading>
                    <Text mb="5px">{mokData.modelMake} {mokData.modelName}</Text>
                    <Text>{mokData.address}</Text>
                </VStack>
                <VStack alignItems="start">
                    <Text>Times rented: {mokData.numRented}</Text>
                    <Text>Time rented: {mokData.timeRented}</Text>
                    <Text>Earnings: {mokData.earnings}</Text>
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
                    {mokData.currRent && (
                    <>
                        <Tr bg="blue.300" my={10}>
                            <Td>{mokData.currRent.fromDate}</Td>
                            <Td>{mokData.currRent.toDate}</Td>
                            <Td>{mokData.currRent.customerName} {mokData.currRent.customerSurname}</Td>
                            <Td>{mokData.currRent.price}</Td>
                            <Td>{mokData.currRent.pickupAdress}</Td>
                            <Td>{mokData.currRent.dropoffAddress}</Td>
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
                        <DynamicRows n={5} data={complatedRents}/>
                    )  : (    
                        <DynamicRows n={5} data={upcomingRents}/>
                    )}
                  </Tbody>
                </Table>
            </TableContainer>

        </VStack>
    )
}