'use client';

import { dealershipLocations } from '@/mockData/mockLocations';
import { Box, Text, Icon, Flex } from '@chakra-ui/react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  StreetViewPanorama,
} from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaCar } from 'react-icons/fa';

// Tip za lokacije
interface DealershipLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  workingHours: string;
  availableCars: number;
}

// Stilovi mape u skladu s vašim brandom
const mapStyles = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }], // Sakriva sve poslovne objekte poput trgovina
  },
  {
    featureType: 'poi.government',
    stylers: [{ visibility: 'off' }], // Sakriva državne urede
  },
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }], // Sakriva škole
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#F5F5F5' }], // Neutralna boja za teren
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#D4F1F9' }], // Svijetlo plava boja za vodene površine
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#E0E0E0' }], // Svijetlo siva za ceste
  },
];

const CustomMap: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedLocation, setSelectedLocation] =
    useState<DealershipLocation | null>(null);

  const mapContainerStyle = useMemo(
    () => ({
      width: '100%',
      height: '400px',
      borderRadius: '10px',
      overflow: 'hidden',
    }),
    []
  );

  const center = useMemo(
    () => ({
      lat: 45.815399, // Središte Zagreba
      lng: 15.966568,
    }),
    []
  );

  const options = useMemo(
    () => ({
      styles: mapStyles,
      disableDefaultUI: true, // Onemogućuje zadane kontrole
      zoomControl: true,
    }),
    []
  );

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      options={options}
      onClick={() => setSelectedLocation(null)} // Zatvori InfoWindow kad kliknete na mapu
    >
      {/* Prikaz markera za svaku lokaciju */}
      {dealershipLocations.map((location: DealershipLocation) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          title={location.name}
          onClick={() => setSelectedLocation(location)} // Postavi odabranu lokaciju
        />
      ))}

      {/* Prikaz InfoWindow za odabranu lokaciju */}
      {selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={() => setSelectedLocation(null)} // Close InfoWindow
        >
          <Box bg="white" borderRadius="md" maxWidth="300px">
            {/* Content without extra padding */}
            <Box px={3} py={2}>
              <Text fontWeight="bold" fontSize="lg" mb={1}>
                {selectedLocation.name}
              </Text>

              <Flex align="center" mb={2}>
                <Icon as={FaMapMarkerAlt} color="brandblue" mr={2} />
                <Text fontSize="sm">{selectedLocation.address}</Text>
              </Flex>

              <Flex align="center" mb={2}>
                <Icon as={FaClock} color="brandblue" mr={2} />
                <Text fontSize="sm">{selectedLocation.workingHours}</Text>
              </Flex>

              <Flex align="center">
                <Icon as={FaCar} color="brandblue" mr={2} />
                <Text fontSize="sm">
                  <strong>Available Cars:</strong>{' '}
                  {selectedLocation.availableCars}
                </Text>
              </Flex>
            </Box>
          </Box>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default CustomMap;
