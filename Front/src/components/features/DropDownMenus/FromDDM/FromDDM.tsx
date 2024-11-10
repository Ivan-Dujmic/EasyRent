/* import { SetStateAction, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  VStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';

const options = {
  'Cities (including airports)': [
    'Zagreb, Croatia',
    'Sesvete, Croatia',
    'Velika Gorica, Croatia',
    'Samobor, Croatia',
  ],
  Airports: ['Franjo Tuđman ZAG, Zagreb, Croatia'],
  'Train stations': [], // Add train stations if available
};

export default function FromDDM() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Filtered options based on search input
  const filteredOptions = Object.keys(options).reduce((acc, category) => {
    const filteredItems = options[category].filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
    if (filteredItems.length) {
      acc[category] = filteredItems;
    }
    return acc;
  }, {});

  const handleSelectLocation = (location: SetStateAction<string>) => {
    setSelectedLocation(location);
    setIsOpen(false); // Zatvaranje menija nakon odabira
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <VStack spacing={4} align="start">
      <Box w="100%">
        <Menu isOpen={isOpen}>
          <MenuButton
            as={Box}
            onClick={toggleMenu}
            w="100%"
            borderWidth="1px"
            borderRadius="md"
            p="2"
            cursor="pointer"
          >
            {/* Prikaz odabranog mjesta ili pretraživanja 
            <Box display="flex" alignItems="center">
              <Input
                placeholder="Search locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Sprječava zatvaranje pri unosu
                variant="unstyled"
                w="100%"
              />
              <ChevronDownIcon ml={2} />
            </Box>
          </MenuButton>
          <MenuList maxH="300px" overflowY="auto">
            <Box px="3" py="2"></Box>
            {Object.keys(filteredOptions).map((category) => (
              <MenuGroup title={category} key={category}>
                {filteredOptions[category].map((item) => (
                  <MenuItem
                    key={item}
                    onClick={() => {
                      setSelectedLocation(item);
                      setSearch(''); // Clear search on selection
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </MenuGroup>
            ))}
          </MenuList>
        </Menu>
      </Box>
      {selectedLocation && (
        <Box display="flex" alignItems="center">
          <Box mr="2" fontWeight="bold">
            Selected Location:
          </Box>
          <Box>{selectedLocation}</Box>
          <IconButton
            aria-label="Clear selection"
            icon={<CloseIcon />}
            ml="2"
            size="sm"
            onClick={() => setSelectedLocation('')}
          />
        </Box>
      )}
    </VStack>
  );
}
 */

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Box,
  InputGroup,
  InputLeftElement,
  Center,
  Flex,
  InputLeftAddon,
  Heading,
  Stack,
  Text,
  MenuGroup,
  IconButton,
  useOutsideClick,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { SetStateAction, useState, useRef } from 'react';
import { FaCarAlt } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa';
import { MdLocalAirport } from 'react-icons/md';
import { FaTrain } from 'react-icons/fa';
import LocationFormatter from './LocationFormatter/LocationFormatter';

const options: { [key: string]: string[] } = {
  'Cities (including airports)': [
    'Zagreb, Croatia',
    'Sesvete, Croatia',
    'Velika Gorica, Croatia',
    'Samobor, Croatia',
    'Split, Croatia',
    'Rijeka, Croatia',
  ],
  Airports: [
    'Franjo Tuđman, ZAG, Zagreb, Croatia',
    'Split Airport, SPU, Split, Croatia',
    'Dubrovnik Airport, DBV, Dubrovnik, Croatia',
  ],
  'Train stations': [
    'Zagreb Central Station, Zagreb, Croatia',
    'Split Train Station, Split, Croatia',
    'Osijek Train Station, Osijek, Croatia',
    'Rijeka Train Station, Rijeka, Croatia',
  ],
};

type Category = 'Cities (including airports)' | 'Airports' | 'Train stations';

const categoryIcons: { [key in Category]: JSX.Element } = {
  'Cities (including airports)': <FaCity />,
  Airports: <MdLocalAirport />,
  'Train stations': <FaTrain />,
};

export default function FromDDM() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  const locations = ['Location 1', 'Location 2', 'Location 3']; // Ovo su primjeri
  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectLocation = (location: string) => {
    const parts = location.split(',').map((part) => part.trim());
    setSelectedLocation(location);
    setSearch(location); // Prikaz odabrane lokacije u Input
    setIsOpen(false); // Zatvori menu
  };

  const handleInputClick = () => {
    if (!isOpen) setIsOpen(true); // Only set to open if not already open
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true); // Ensure the menu stays open while typing
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const filteredOptions: { [key: string]: string[] } = Object.keys(
    options
  ).reduce(
    (acc, category) => {
      const filteredItems = options[category].filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredItems.length) {
        acc[category] = filteredItems;
      }
      return acc;
    },
    {} as { [key: string]: string[] }
  );

  const renderCategoryIcon = (category: Category): JSX.Element => {
    return categoryIcons[category] || <span />; // Return a fallback (empty span) if no icon is found
  };

  return (
    <Stack gap={0} position={'relative'} ref={ref}>
      <Menu isOpen={isOpen}>
        <Text fontSize={'0.8rem'} color={'brandblue'}>
          Pick-up location
        </Text>
        <InputGroup
          height={'fit-content'}
          borderWidth={'2px'}
          borderRadius="md"
          borderColor={'brandblue'}
          width={'fit-content'}
          bg={'brandlightgray'}
          _focusWithin={{
            bg: 'brandwhite',
            borderColor: 'brandblack',
            color: 'brandblack',
          }}
          maxWidth={'14rem'}
        >
          <InputLeftElement pointerEvents="none" color="brandblack">
            <FaCarAlt />
          </InputLeftElement>
          <Input
            onClick={handleInputClick}
            cursor="pointer"
            placeholder="Search locations..."
            value={search}
            onChange={handleInputChange}
            color={'brandblack'}
            border={'none'}
            _focus={{ borderColor: 'none', boxShadow: 'none' }}
          />
        </InputGroup>
        <MenuList
          position="absolute"
          top="calc(100% + 70px)"
          left="0"
          maxH="300px"
          overflowY="auto"
          zIndex="1000"
          color={'brandblack'}
        >
          {Object.keys(filteredOptions).length > 0 ? (
            Object.keys(filteredOptions).map((category) => (
              <MenuGroup title={category} key={category}>
                {filteredOptions[category as Category].map((item) => (
                  <MenuItem
                    key={item}
                    onClick={() => {
                      handleSelectLocation(item);
                    }}
                    fontSize="sm"
                    gap={2}
                  >
                    <Box p={2} borderRadius="3px" bg="brandmiddlegray">
                      {renderCategoryIcon(category as Category)}
                    </Box>
                    <LocationFormatter
                      input={item}
                      type={category as Category}
                    />
                  </MenuItem>
                ))}
              </MenuGroup>
            ))
          ) : (
            <MenuItem fontSize="sm" color="brandgray">
              No matching locations found
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Stack>
  );
}
