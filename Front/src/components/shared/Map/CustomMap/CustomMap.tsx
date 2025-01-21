'use client';

import { ExtraLocationInfo } from '@/typings/locations/locations';
import { Box, Text, Icon, Flex, Spinner } from '@chakra-ui/react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from '@react-google-maps/api';
import { useMemo, useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaCar } from 'react-icons/fa';

interface CustomMapProps {
  locations: ExtraLocationInfo[]; // Lista lokacija
  showInfoWindow?: boolean; // Opcionalno prikazivanje InfoWindow
  focusOnClosestLocation?: boolean;
}

// Funkcija za izračun najbliže lokacije
const getClosestLocation = (
  lat: number,
  lng: number,
  locations: ExtraLocationInfo[]
): ExtraLocationInfo | null => {
  if (!locations || locations.length === 0) {
    console.warn('No locations provided');
    return null;
  }

  let closestLocation = locations[0];
  let minDistance = Number.MAX_VALUE;

  locations.forEach((location) => {
    if (location.latitude && location.longitude) {
      const distance = Math.sqrt(
        Math.pow(lat - parseFloat(location.latitude), 2) +
          Math.pow(lng - parseFloat(location.longitude), 2)
      );

      if (distance < minDistance) {
        closestLocation = location;
        minDistance = distance;
      }
    } else {
      console.warn('Invalid location data:', location);
    }
  });

  return closestLocation;
};

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
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.medical',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'off' }],
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

// Funkcija za generiranje random radnog vremena
const generateRandomWorkingHours = () => {
  const openingHour = Math.floor(Math.random() * (10 - 6 + 1)) + 6; // Between 6 and 10
  const closingHour = Math.floor(Math.random() * (20 - 17 + 1)) + 17; // Between 17 and 20
  return `${openingHour}:00-${closingHour}:00`;
};

const CustomMap: React.FC<CustomMapProps> = ({
  locations,
  showInfoWindow = true,
  focusOnClosestLocation = false,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const enrichedLocations = useMemo(() => {
    return locations.map((location) => ({
      ...location,
      workingHours: location.workingHours || generateRandomWorkingHours(), // Generate random working hours
      availableCars:
        location.availableCars !== undefined
          ? location.availableCars
          : Math.floor(Math.random() * (25 - 7 + 1)) + 7, // Random between 7-25
    }));
  }, [locations]);

  const [selectedLocation, setSelectedLocation] =
    useState<ExtraLocationInfo | null>(null);
  const [center, setCenter] = useState({ lat: 45.815399, lng: 15.966568 }); // Default Zagreb center
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showUserInfoWindow, setShowUserInfoWindow] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          if (focusOnClosestLocation) {
            const closest = getClosestLocation(
              latitude,
              longitude,
              enrichedLocations
            );
            if (closest !== null) {
              setCenter({
                lat: parseFloat(closest.latitude),
                lng: parseFloat(closest.longitude),
              });
            }
          } else {
            setCenter({ lat: latitude, lng: longitude });
          }
        },
        () => {
          if (!focusOnClosestLocation) {
            setCenter({ lat: 45.815399, lng: 15.966568 });
          }
        }
      );
    }
  }, [enrichedLocations, focusOnClosestLocation]);

  const mapContainerStyle = useMemo(
    () => ({
      width: '100%',
      height: '400px',
      borderRadius: '10px',
      overflow: 'hidden',
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

  if (!isLoaded) {
    return <Spinner color="brandblue" size="lg" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      options={options}
      onClick={() => {
        setSelectedLocation(null);
        setShowUserInfoWindow(false);
      }}
    >
      {/* Prikaz markera za svaku lokaciju */}
      {enrichedLocations.map((location: ExtraLocationInfo) => (
        <Marker
          key={location.location_id}
          position={{
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude),
          }}
          title={location.companyName}
          onClick={() => {
            setSelectedLocation(location);
            setShowUserInfoWindow(false);
          }} // Postavi odabranu lokaciju
        />
      ))}

      {/* Prikaz korisnikove lokacije ako je dostupna */}
      {userLocation && (
        <>
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#007BFF',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
            title="You are here!"
            onClick={() => setShowUserInfoWindow(true)} // Otvori InfoWindow za korisnika
          />
          {showUserInfoWindow && (
            <InfoWindow
              position={userLocation}
              onCloseClick={() => setShowUserInfoWindow(false)}
            >
              <Box bg="white" p={2} borderRadius="md" boxShadow="md">
                <Text fontSize="sm" fontWeight="bold">
                  Yes, this little blue dot is you!
                </Text>
              </Box>
            </InfoWindow>
          )}
        </>
      )}

      {/* Prikaz InfoWindow za odabranu lokaciju */}
      {showInfoWindow && selectedLocation && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedLocation.latitude),
            lng: parseFloat(selectedLocation.longitude),
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <Box bg="white" borderRadius="md" maxWidth="300px">
            <Box px={3} py={2}>
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontWeight="bold" fontSize="lg">
                  {selectedLocation.companyName}
                </Text>
              </Flex>

              <Flex align="center" mb={2}>
                <Icon as={FaMapMarkerAlt} color="brandblue" mr={2} />
                <Text fontSize="sm">
                  {`${selectedLocation.streetName} ${selectedLocation.streetNo}, ${selectedLocation.cityName}`}
                </Text>
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
