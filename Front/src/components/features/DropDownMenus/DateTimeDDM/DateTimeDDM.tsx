'use client';

import { useState, useRef } from 'react';
import {
  Stack,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  useBreakpointValue,
  useOutsideClick,
  Box,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './custom-calendar.css'; // Import custom styles

interface LocationDDMProps {
  description: string;
  placeHolder: string;
}

export default function DateTimeDDM({
  description,
  placeHolder,
}: LocationDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value); // Set selected date
      setIsOpen(false); // Close calendar dropdown
    } else if (Array.isArray(value) && value.length === 2) {
      // Handle date range (if enabled in the future)
      const [startDate, endDate] = value;
      console.log('Selected Date Range:', startDate, endDate);
    }
  };

  const descriptionFontSize = useBreakpointValue({
    base: '0.75rem', // Smaller text on mobile devices
    md: '0.8rem', // Slightly larger text for medium screens
    lg: '0.8rem', // Even larger for larger screens
  });

  return (
    <Stack gap={0} position="relative" ref={ref} width="100%">
      <Text fontSize={descriptionFontSize} color="brandblue">
        {description}
      </Text>
      <InputGroup
        height="fit-content"
        borderWidth="2px"
        borderRadius="md"
        borderColor="brandblue"
        width="100%"
        bg="brandlightgray"
        _focusWithin={{
          bg: 'brandwhite',
          borderColor: 'brandblack',
          color: 'brandblack',
        }}
      >
        <InputLeftElement pointerEvents="none" color="brandblack">
          <CalendarIcon />
        </InputLeftElement>
        <Input
          onClick={() => setIsOpen(!isOpen)} // Toggle calendar dropdown
          cursor="pointer"
          placeholder={placeHolder}
          value={selectedDate ? selectedDate.toLocaleDateString() : ''} // Display selected date
          readOnly // Prevent text input
          color="brandblack"
          border="none"
          _focus={{ borderColor: 'none', boxShadow: 'none' }}
        />
      </InputGroup>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          zIndex="10"
          mt={2}
          boxShadow="lg"
          borderRadius="md"
          bg="white"
          p={0}
        >
          <Calendar
            onChange={handleDateChange} // Handle date change
            value={selectedDate} // Current selected date
            minDate={new Date()} // Disable past dates
            view="month" // Limit view to month only
            onClickYear={() => setIsOpen(false)} // Disable year selection
            onClickDecade={() => setIsOpen(false)} // Disable decade selection
            tileClassName={({ date, view }) =>
              view === 'month' &&
              date.toDateString() === new Date().toDateString()
                ? 'react-calendar__tile--now' // Highlight today's date
                : undefined
            }
            className="custom-calendar" // Apply custom styles
          />
        </Box>
      )}
    </Stack>
  );
}
