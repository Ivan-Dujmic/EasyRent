// !! ovo je smao placeholder, morat ce se zapravo implementirat

import {
  Menu,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { LocationDDMProps } from '@/typings/DDM-DropDownMenu/DDM';
import { CalendarIcon } from '@chakra-ui/icons';

export default function DateTimeDDM({
  description,
  placeHolder,
}: LocationDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  const handleInputClick = () => {
    if (!isOpen) setIsOpen(true); // otvori menu samo ako do sada nije vec otvoren
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true); // osigurava da meni ostaje otvoren dok tipkamo
  };

  return (
    <Stack gap={0} position={'relative'} ref={ref}>
      <Menu isOpen={isOpen}>
        <Text fontSize={'0.8rem'} color={'brandblue'}>
          {description}
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
          maxWidth={'7rem'}
        >
          <InputLeftElement pointerEvents="none" color="brandblack">
            <CalendarIcon />
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
          />
        </InputGroup>
      </Menu>
    </Stack>
  );
}
