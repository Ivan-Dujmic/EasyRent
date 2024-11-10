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
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { SetStateAction, useState } from 'react';
import { FaCarAlt } from 'react-icons/fa';

export default function FromDDM() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = ['Location 1', 'Location 2', 'Location 3']; // Ovo su primjeri
  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectLocation = (location: SetStateAction<string>) => {
    setSelectedLocation(location);
    setSearch(location); // Prikaz odabrane lokacije u Input
    setIsOpen(false); // Zatvori menu
  };

  const handleInputClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // Sprječava zatvaranje prilikom klika na Input
    setIsOpen(true); // Otvori menu
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Menu isOpen={isOpen}>
      <InputGroup
        height={'fit-content'}
        borderWidth={'2px'}
        borderRadius="md"
        borderColor={'brandblue'}
        maxWidth="250px"
        bg={'brandlightgray'}
        _focusWithin={{
          bg: 'brandwhite',
          borderColor: 'brandblack',
          color: 'brandblack',
        }}
      >
        <InputLeftElement pointerEvents="none">
          <FaCarAlt />
        </InputLeftElement>
        <Input
          onClick={toggleMenu}
          cursor="pointer"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          color={'brandblack'}
          border={'none'}
        />
      </InputGroup>
    </Menu>
  );
}
