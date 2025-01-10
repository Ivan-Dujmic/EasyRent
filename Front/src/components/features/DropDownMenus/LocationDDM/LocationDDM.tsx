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
import { useState, useRef } from 'react';
import { FaCarAlt } from 'react-icons/fa';
import LocationDDMGroups from './LocationDDMGroups/LocationDDMGroups';
import { LocationDDMProps } from '@/typings/DDM-DropDownMenu/DDM';

export default function LocationDDM({
  options,
  description,
  placeHolder,
}: LocationDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

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

  const handleSelectLocation = (location: string) => {
    setSearch(location); // Prikaz odabrane lokacije u Input
    setIsOpen(false); // Zatvori menu
  };

  const handleInputClick = () => {
    if (!isOpen) setIsOpen(true); // otvori menu samo ako do sada nije vec otvoren
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true); // osigurava da meni ostaje otvoren dok tipkamo
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
        >
          <InputLeftElement pointerEvents="none" color="brandblack">
            <FaCarAlt />
          </InputLeftElement>
          <Input
            onClick={handleInputClick}
            cursor="pointer"
            placeholder={placeHolder}
            value={search}
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
            search={search}
            setSearch={() => {
              return;
            }}
          />
        </MenuList>
      </Menu>
    </Stack>
  );
}
