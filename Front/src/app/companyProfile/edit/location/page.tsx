"use client"

import CustomInput from "@/components/shared/auth/CustomInput";
import CustomMap from "@/components/shared/Map/CustomMap/CustomMap";
import { IEditLocations } from "@/typings/company/company";
import { Box, Flex, VStack, useBreakpointValue,  } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import AddressAutocomplete from "@/components/shared/profile/company/AddressAutocomplete";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API Key

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default location (San Francisco)


export default function EditLocation () 
{
    const {handleSubmit,
        formState: { isSubmitting, errors},
        clearErrors,
        register,
        setValue,
        getValues,
    } = useForm<IEditLocations>()

    const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(defaultCenter);

  const handlePlaceSelect = async (place: google.maps.places.PlaceResult) => {
    if (!place.geometry) return;

    setAddress(place.formatted_address || "");
    setCoordinates({
      lat: place.geometry.location?.lat() || 0,
      lng: place.geometry.location?.lng() || 0,
    });
  };

    const boxWidth = useBreakpointValue({
      base: '90vw', // Small screens
      md: '70vw', // Medium screens
      lg: '50vw', // Large screens
    });

    return (
        <Box
        width={boxWidth}
        margin="0 auto"
        mt="10"
        p={{ base: 4, md: 6 }}
        boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
        borderRadius="md"
        bg="brandwhite"
        >
            <Flex w="100%">
                <VStack>
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                        <AddressAutocomplete onPlaceSelect={handlePlaceSelect} />

                        <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates} zoom={14}>
                            <Marker position={coordinates} />
                        </GoogleMap>
                    </LoadScript>
                </VStack>
            </Flex>
        </Box>
    )
}