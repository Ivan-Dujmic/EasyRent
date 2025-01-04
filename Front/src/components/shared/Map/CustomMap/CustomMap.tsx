'use client';

import { Box, Text, Icon, Flex } from '@chakra-ui/react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
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

interface CustomMapProps {
  locations: DealershipLocation[]; // Lista lokacija
  showInfoWindow?: boolean; // Opcionalno prikazivanje InfoWindow
}

// Stilovi mape u skladu s vašim brandom
const mapStyles = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.government',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'off' }], // Hides parks
  },
  {
    featureType: 'poi.medical',
    stylers: [{ visibility: 'off' }], // Hides hospitals/medical facilities
  },
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'off' }], // Hides museums and attractions
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#F5F5F5' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#D4F1F9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#E0E0E0' }],
  },
];

const CustomMap: React.FC<CustomMapProps> = ({
  locations,
  showInfoWindow = true,
}) => {
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
      lat: 45.815399,
      lng: 15.966568,
    }),
    []
  );

  const options = useMemo(
    () => ({
      styles: mapStyles,
      disableDefaultUI: true,
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
      onClick={() => setSelectedLocation(null)}
    >
      {/* Prikaz markera za svaku lokaciju */}
      {locations.map((location: DealershipLocation) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          title={location.name}
          onClick={() => showInfoWindow && setSelectedLocation(location)} // Postavi odabranu lokaciju
        />
      ))}

      {/* Prikaz InfoWindow za odabranu lokaciju */}
      {showInfoWindow && selectedLocation && (
        <InfoWindow
          position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <Box bg="white" borderRadius="md" maxWidth="300px">
            <Box px={3} py={2}>
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontWeight="bold" fontSize="lg">
                  {selectedLocation.name}
                </Text>
              </Flex>

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
