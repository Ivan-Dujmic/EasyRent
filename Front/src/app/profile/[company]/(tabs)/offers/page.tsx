"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import OfferCard from "@/components/shared/cars/OfferCardCompany/OfferCardCompany";
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
  
export default function CompanyProfileOffers() {
    return(
    <Box px={10} w="100%">
    <SupportButton href="profile/${company}/addoffer" mb="20px" ml="5%">Add Offer</SupportButton>
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={6}
      >
        {mokcars.map((offer, indx) =>(
            <OfferCard key={indx} offer={offer}/>
        ))
        }
      </Grid>
    </Box>
    )
}