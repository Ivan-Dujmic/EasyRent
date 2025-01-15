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
  value?: string; // Dodan prop za inicijalnu vrijednost
}

export default function LocationDDM({
  options,
  description,
  placeHolder,
  onLocationChange,
  value, // Novi prop za vrijednost
}: EnhancedLocationDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState<string | null>(value || null); // Inicijalna vrijednost dolazi iz value

  const ref = useRef(null);

  const inputTextSize = useBreakpointValue({
    base: 'sm', // Manji tekst za male ekrane
    md: 'md', // Normalan tekst za srednje i velike ekrane
  });

  const inputWidth = useBreakpointValue({
    base: '100%', // Zauzima ceo prostor na manjim ekranima
    md: '100%', // Automatski zauzima prostor na većim ekranima
  });

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  // Kada se promijeni prop `value`, ažuriraj stanje komponente
  useEffect(() => {
    setSearch(value || null);
  }, [value]);

  const handleSelectLocation = (location: string) => {
    setSearch(location);
    onLocationChange?.(location); // Obavijesti roditelja o odabiru lokacije
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!isOpen) setIsOpen(true); // Otvori menu samo ako nije već otvoren
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      setSearch(null); // Postavi vrijednost na null kad se polje izbriše
      onLocationChange?.(''); // Obavijesti roditelja o brisanju lokacije
    }

    if (!isOpen) setIsOpen(true); // Osigurava da menu ostaje otvoren dok tipkamo
  };

  return (
    <Stack gap={0} position={'relative'} ref={ref} width="100%">
      <Menu isOpen={isOpen}>
        <Text fontSize={'0.8rem'} color={'brandblue'}>
          {description}
        </Text>
        <InputGroup
          height={'fit-content'}
          borderWidth={'2px'}
          borderRadius="md"
          borderColor={'brandblue'}
          width={inputWidth} // Omogućava maksimalno širenje
          bg={'brandlightgray'}
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
            value={search || ''} // Prikaži prazan string ako je null
            onChange={handleInputChange}
            color={'brandblack'}
            border={'none'}
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
          color={'brandblack'}
        >
          <LocationDDMGroups
            options={options}
            handleSelectLocation={handleSelectLocation}
            search={search || ''} // Proslijedi prazan string ako je null
            setSearch={() => {
              return;
            }}
          />
        </MenuList>
      </Menu>
    </Stack>
  );
}
