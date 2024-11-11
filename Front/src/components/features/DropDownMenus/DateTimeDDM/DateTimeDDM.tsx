import { useState, useRef } from 'react';
import {
  Stack,
  Menu,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  useBreakpointValue,
  useOutsideClick,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { LocationDDMProps } from '@/typings/DDM-DropDownMenu/DDM';

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

  // Responsive values for different screen sizes
  const inputMaxWidth = useBreakpointValue({
    base: '10rem', // For small screens (like mobile)
    md: '15rem', // For medium screens (like tablets)
    lg: '20rem', // For large screens (like desktops/laptops)
  });

  const descriptionFontSize = useBreakpointValue({
    base: '0.75rem', // Smaller text on mobile
    md: '0.8rem', // Slightly bigger text on medium screens
    lg: '0.8em', // Larger text on larger screens
  });

  return (
    <Stack gap={0} position={'relative'} ref={ref}>
      <Menu isOpen={isOpen}>
        <Text fontSize={descriptionFontSize} color={'brandblue'}>
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
          maxWidth={inputMaxWidth} // Apply responsive maxWidth
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
