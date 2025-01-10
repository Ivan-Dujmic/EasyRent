"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import VehicleCard from "@/components/shared/cards/VehicleCardCompany/VehicleCardCompany";
import { Box, Grid } from "@chakra-ui/react";

interface ICar {
    image: string;
    companyName: string;
    modelName: string;
    makeName: string;
    noOfSeats: string;
    automatic: string;
    price: string;
    rating: string;
    noOfReviews: string;
  }

const mokcars = [
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
    {
        image: "image",
        companyName: "companyName",
        modelName: "modelName",
        makeName: "makeName",
        noOfSeats: "noOfSeats",
        automatic: "automatic",
        price: "price",
        rating: "4.0",
        noOfReviews: "1000",
        registration: "registration"
    },
];
  
export default function CompanyProfileVehicles() {
    return(
    <Box p={10} w="100%">
    <SupportButton href="profile/${company}/addvehicle" mb="20px" ml="5%">Add Vehicle</SupportButton>
      <Grid
        templateColumns="repeat(auto-fit, minmax(180px, 1fr))"
        gap={6}
      >
        {mokcars.map((car, indx) =>(
            <VehicleCard key={indx} vehicle={car}/>
        ))
        }
      </Grid>
    </Box>
    )
}