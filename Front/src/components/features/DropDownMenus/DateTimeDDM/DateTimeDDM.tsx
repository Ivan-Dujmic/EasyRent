'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Stack,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useOutsideClick,
  Box,
  Select,
  Flex,
} from '@chakra-ui/react';
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './custom-calendar.css';

interface DateTimeDDMProps {
  description: string;
  placeHolder: string;
  minDate?: Date;
  maxDate?: Date;
  minTime?: string; // Minimalno dopušteno vrijeme
  initialDate?: Date; // Početna vrijednost datuma
  initialTime?: string; // Početna vrijednost vremena
  onDateTimeChange?: (dateTime: Date | null) => void;
}

export default function DateTimeDDM({
  description,
  placeHolder,
  minDate,
  maxDate,
  minTime,
  initialDate,
  initialTime,
  onDateTimeChange,
}: DateTimeDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    initialTime || null
  );
  const [error, setError] = useState(false);

  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  useEffect(() => {
    // Ako imamo početne vrijednosti, pošalji ih roditelju
    if (initialDate && initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      const dateTime = new Date(initialDate);
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);
      onDateTimeChange?.(dateTime);
    } else if (initialDate) {
      onDateTimeChange?.(initialDate);
    } else {
      onDateTimeChange?.(null);
    }
  }, [initialDate, initialTime, onDateTimeChange]);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setIsOpen(false);

      if (selectedTime) {
        // Kombiniraj datum i vrijeme
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const dateTime = new Date(value);
        dateTime.setHours(hours);
        dateTime.setMinutes(minutes);
        setError(false);
        onDateTimeChange?.(dateTime); // Pošalji novu vrijednost roditelju
      } else {
        setError(true); // Ako vrijeme nije postavljeno, prijavi grešku
      }
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const time = event.target.value;
    setSelectedTime(time);

    if (selectedDate) {
      // Kombiniraj vrijeme s odabranim datumom
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);
      setError(false);
      onDateTimeChange?.(dateTime); // Pošalji novu vrijednost roditelju
    } else {
      setError(true); // Ako datum nije odabran, prijavi grešku
    }
  };

  const handleClearDateTime = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setError(true);
    onDateTimeChange?.(null); // Resetiraj vrijednost roditelju
  };

  const isTimeDisabled = (time: string) => {
    if (!minTime) return false;
    const [minHours, minMinutes] = minTime.split(':').map(Number);
    const [currentHours, currentMinutes] = time.split(':').map(Number);

    return (
      currentHours < minHours ||
      (currentHours === minHours && currentMinutes < minMinutes)
    );
  };

  return (
    <Stack gap={0} ref={ref} position="relative" flexGrow={1}>
      <Text fontSize="sm" color="brandblue">
        {description}
      </Text>
      <Flex
        gap={2}
        direction={{ base: 'row', md: 'column', lg: 'row' }}
        align="center"
      >
        {/* Date Input */}
        <InputGroup width={{ base: '80%', md: '100%', lg: '70%' }}>
          <InputLeftElement pointerEvents="none">
            <CalendarIcon color={'brandblack'} />
          </InputLeftElement>
          <Input
            placeholder={placeHolder}
            value={selectedDate ? selectedDate.toLocaleDateString() : ''}
            readOnly
            onClick={() => setIsOpen(!isOpen)}
            borderWidth={'2px'}
            borderRadius="md"
            borderColor={error ? 'brandyellow' : 'brandblue'}
            bg={'brandlightgray'}
            color="brandblack"
            _focusWithin={{
              bg: 'brandwhite',
              borderColor: error ? 'brandyellow' : 'brandblack',
            }}
          />
          {selectedDate && (
            <InputRightElement>
              <IconButton
                aria-label="Clear date"
                icon={<CloseIcon />}
                size="sm"
                onClick={handleClearDateTime}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {/* Time Dropdown */}
        <Select
          placeholder="Select"
          value={selectedTime || ''} // Prikaži trenutni odabrani sat
          onChange={handleTimeChange}
          width={{ base: '110px', md: '100%', lg: '110px' }}
          borderWidth={'2px'}
          borderRadius="md"
          borderColor={error ? 'brandyellow' : 'brandblue'}
          bg={'brandlightgray'}
          color="brandblack"
          _focusWithin={{
            bg: 'brandwhite',
            borderColor: error ? 'brandyellow' : 'brandblack',
          }}
        >
          {Array.from({ length: 24 }, (_, hour) => (
            <option
              key={hour}
              value={`${hour}:00`}
              disabled={isTimeDisabled(`${hour}:00`)}
            >
              {`${hour}:00`}
            </option>
          ))}
          {Array.from({ length: 24 }, (_, hour) => (
            <option
              key={`${hour}:30`}
              value={`${hour}:30`}
              disabled={isTimeDisabled(`${hour}:30`)}
            >
              {`${hour}:30`}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Calendar */}
      {isOpen && (
        <Box position="absolute" top="100%" zIndex="10">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={minDate || new Date()}
            maxDate={maxDate}
          />
        </Box>
      )}
    </Stack>
  );
}
