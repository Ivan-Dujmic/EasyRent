"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import OfferCard from "@/components/shared/cars/OfferCardCompany/OfferCardCompany";
import { useUserContext } from "@/context/UserContext/UserContext";
import { CustomDelete } from "@/fetchers/delete";
import { CustomGet } from "@/fetchers/get";
import { swrKeys } from "@/fetchers/swrKeys";
import { IOffer } from "@/typings/offers/offers.type";
import { Box, Grid } from "@chakra-ui/react";
import useSWR, { mutate } from "swr";
  
export default function CompanyProfileOffers() {
    const { data: offers } = useSWR(swrKeys.companyOffers, CustomGet<IOffer[]>);
    const { user } = useUserContext();
    offers?.sort((a, b) => Number(b.isVisible) - Number(a.isVisible));
    const handleDelete = async (id : number) => {
        try {
            CustomDelete<void>(swrKeys.companyOfferDelete + id)
            mutate(swrKeys.companyOffers); // Re-fetch the data from the server
            offers?.sort((a, b) => Number(b.isVisible) - Number(a.isVisible));
            
          } catch (error) {
            console.error('Delete failed', error);
          }
    };

    return(
    <Box px={10} w="100%">
    <SupportButton href={`profile/${user.firstName}/addoffer`} mb="20px" ml="5%">Add Offer</SupportButton>
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={6}
      >
        {offers?.map((offer, indx) =>(
            <OfferCard key={indx} offer={offer} handleDelete={handleDelete}/>
        ))
        }
      </Grid>
    </Box>
    )
}