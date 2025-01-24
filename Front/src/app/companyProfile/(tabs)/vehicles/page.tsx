"use client";

import SupportButton from "@/components/shared/auth/SupportButton";
import VehicleCard from "@/components/shared/cars/VehicleCardCompany/VehicleCardCompany";
import { swrKeys } from "@/fetchers/swrKeys";
import { Box, Grid } from "@chakra-ui/react";
import useSWR, { mutate } from "swr";
import { IVehicle } from "@/typings/vehicles/vehicles.type";
import { CustomGet } from "@/fetchers/get";
import { useUserContext } from "@/context/UserContext/UserContext";
import { CustomDelete } from "@/fetchers/delete";
  
export default function CompanyProfileVehicles() {
    const { data: carsAll } = useSWR(swrKeys.companyVehicles + '?limit=20', CustomGet<any>);
    const cars = carsAll?.results as IVehicle[];
    const { user } = useUserContext();
    cars?.sort((a, b) => Number(b.isVisible) - Number(a.isVisible));
    const handleDelete = async (id : number) => {
        try {
            await CustomDelete<void>(swrKeys.companyVehicleDelete + id + '/')
            mutate(swrKeys.companyVehicles); // Re-fetch the data from the server
            cars?.sort((a, b) => Number(b.isVisible) - Number(a.isVisible));
            
          } catch (error) {
            console.error('Delete failed', error);
          }
    };
    
    return(
    <Box px={40} w="100%">
    <SupportButton href={`profile/${user.firstName}/addvehicle`} mb="20px" ml="5%">Add Vehicle</SupportButton>
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={6}
      >
        {cars?.map((car, indx) =>(
            <VehicleCard key={indx} vehicle={car} handleDelete={handleDelete}/>
        ))
        }
      </Grid>
    </Box>
    )
}