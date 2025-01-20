'use client';

import {
  Menu,
  MenuList,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useOutsideClick,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { FaCarAlt } from 'react-icons/fa';
import LocationDDMGroups from './LocationDDMGroups/LocationDDMGroups';
import { LocationDDMProps } from '@/typings/DDM-DropDownMenu/DDM';

interface EnhancedLocationDDMProps extends LocationDDMProps {
  value?: string; // Added prop for initial value
}

export default function LocationDDM({
  options, // { [countryName: string]: string[] }
  description,
  placeHolder,
  onLocationChange,
  value, // Current selected value (e.g. "Zagreb, Croatia")
}: EnhancedLocationDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string | null>(value || null);

  const ref = useRef<HTMLDivElement | null>(null);

  const inputTextSize = useBreakpointValue({
    base: 'sm',
    md: 'md',
  });

  const inputWidth = useBreakpointValue({
    base: '100%',
    md: '100%',
  });

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  // Update local state if the parent passes in a new value
  useEffect(() => {
    setSearch(value || null);
  }, [value]);

  const handleSelectLocation = (location: string) => {
    setSearch(location);
    onLocationChange?.(location);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);

    // If user erases everything, also inform the parent
    if (val.trim() === '') {
      setSearch(null);
      onLocationChange?.('');
    }

    // Open the menu while typing
    if (!isOpen) setIsOpen(true);
  };

  return (
    <Stack gap={0} position="relative" ref={ref} width="100%">
      <Menu isOpen={isOpen}>
        <Text fontSize="0.8rem" color="brandblue">
          {description}
        </Text>
        <InputGroup
          height="fit-content"
          borderWidth="2px"
          borderRadius="md"
          borderColor="brandblue"
          width={inputWidth}
          bg="brandlightgray"
          _focusWithin={{
            bg: 'brandwhite',
            borderColor: 'brandblack',
            color: 'brandblack',
          }}
          _hover={{
            borderColor: '#cbd5e0',
            transition: 'border-color 0.2s ease-in-out',
          }}
        >
          <InputLeftElement pointerEvents="none" color="brandblack">
            <FaCarAlt />
          </InputLeftElement>
          <Input
            onClick={handleInputClick}
            cursor="pointer"
            placeholder={placeHolder}
            value={search || ''}
            onChange={handleInputChange}
            color="brandblack"
            border="none"
            _focus={{ borderColor: 'none', boxShadow: 'none' }}
            fontSize={inputTextSize}
          />
        </InputGroup>
        <MenuList
          position="absolute"
          top="calc(100% + 70px)"
          left="0"
          maxH="300px"
          overflowY="auto"
          zIndex="1000"
          color="brandblack"
        >
          {/* Pass the filtered data to the groups component */}
          <LocationDDMGroups
            options={options}
            handleSelectLocation={handleSelectLocation}
            search={search || ''}
            setSearch={() => null}
          />
        </MenuList>
      </Menu>
    </Stack>
  );
}
