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
  initialDate?: Date | null; // Početna vrijednost datuma i vremena
  relatedMinDate?: Date; // Ograničenje za minimum datuma kod drop-off
  relatedMaxDate?: Date; // Ograničenje za maksimum datuma kod pickup
  onDateTimeChange?: (dateTime: Date | null) => void;
}

export default function DateTimeDDM({
  description,
  placeHolder,
  minDate,
  maxDate,
  minTime,
  initialDate,
  relatedMinDate,
  relatedMaxDate,
  onDateTimeChange,
}: DateTimeDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const updateRef = useRef(false);

  const ref = useRef(null);

  useOutsideClick({
    ref,
    handler: () => setIsOpen(false),
  });

  // Postavi početne vrijednosti iz initialDate
  useEffect(() => {
    if (initialDate) {
      const hours = String(initialDate.getHours());
      const minutes = String(initialDate.getMinutes()).padStart(2, '0');
      setSelectedDate(initialDate);
      setSelectedTime(`${hours}:${minutes}`);
    }
  }, [initialDate]);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      // kada se promejni datum odmah updejatj to, maka ri sa defolut vrmeenom
      onDateTimeChange?.(new Date(value));

      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const dateTime = new Date(value);
        dateTime.setHours(hours);
        dateTime.setMinutes(minutes);

        // Obavijesti roditelja
        onDateTimeChange?.(dateTime);
      }
      setIsOpen(false);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const time = event.target.value;
    if (!time) {
      setSelectedTime(null);
      onDateTimeChange?.(selectedDate); // Obavijesti roditelja samo o datumu
      return;
    }

    setSelectedTime(time);

    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);

      // Obavijesti roditelja
      if (!updateRef.current) {
        updateRef.current = true;
        onDateTimeChange?.(dateTime);
        setTimeout(() => (updateRef.current = false), 100); // Debounce update
      }
    } else {
      // Ako nema odabranog datuma, prikaži grešku
      setShowError(true);
    }
  };

  const handleClearDateTime = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowError(false); // Resetiraj grešku

    // Resetiraj roditelju
    onDateTimeChange?.(null);
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
            borderColor={'brandblue'}
            bg={'brandlightgray'}
            color="brandblack"
            _focusWithin={{
              bg: 'brandwhite',
              borderColor: 'brandblack',
            }}
          />
          {(selectedDate || selectedTime) && (
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
          placeholder="Select Time"
          value={selectedTime || ''} // Prikaži trenutni odabrani sat
          onChange={handleTimeChange}
          width={{ base: '110px', md: '100%', lg: '110px' }}
          borderWidth={'2px'}
          borderRadius="md"
          borderColor={'brandblue'}
          bg={'brandlightgray'}
          color="brandblack"
          _focusWithin={{
            bg: 'brandwhite',
            borderColor: 'brandblack',
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
            minDate={relatedMinDate || minDate || new Date()}
            maxDate={relatedMaxDate || maxDate}
          />
        </Box>
      )}
    </Stack>
  );
}
