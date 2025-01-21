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
  Box,
  Select,
  Flex,
} from '@chakra-ui/react';
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './custom-calendar-booking.css';

interface RentalInterval {
  dateTimeRented: string;
  dateTimeReturned: string;
}

interface WorkingHour {
  dayOfTheWeek: number;
  startTime: string;
  endTime: string;
}

interface DateTimeDDMProps {
  description: string;
  placeHolder: string;
  intervals: RentalInterval[];
  workingHours: WorkingHour[];
  minDate?: Date;
  maxDate?: Date;
  onDateTimeChange?: (dateTime: Date | null) => void;
}

export default function BookingCalendar({
  description,
  placeHolder,
  intervals,
  workingHours,
  minDate = new Date(),
  maxDate,
  onDateTimeChange,
}: DateTimeDDMProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const ref = useRef(null);

  // Function to extract disabled dates from intervals
  const getDisabledDates = () => {
    const disabledDates: string[] = [];

    intervals.forEach((interval) => {
      const start = new Date(interval.dateTimeRented);
      const end = new Date(interval.dateTimeReturned);

      let currentDate = new Date(start);
      while (currentDate <= end) {
        disabledDates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 1);
    while (pastDate < today) {
      disabledDates.push(pastDate.toISOString().split('T')[0]);
      pastDate.setDate(pastDate.getDate() - 1);
    }

    return disabledDates;
  };

  const disabledDates = getDisabledDates();

  // Handle date selection from calendar
  const handleDateChange = (value: Date) => {
    const formattedDate = value.toISOString().split('T')[0];

    if (disabledDates.includes(formattedDate)) return;

    setSelectedDate(value);
    setIsOpen(false);
    onDateTimeChange?.(value);
  };

  // Handle time selection based on working hours
  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = event.target.value;
    setSelectedTime(selectedTime);

    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes);
      onDateTimeChange?.(dateTime);
    }
  };

  // Generate available time options based on working hours
  const getAvailableTimes = () => {
    if (!selectedDate) return [];

    const dayOfWeek = selectedDate.getDay();
    const workingHour = workingHours.find(
      (wh) => wh.dayOfTheWeek === dayOfWeek
    );

    if (!workingHour) return [];

    const times = [];
    let [startHour, startMinute] = workingHour.startTime.split(':').map(Number);
    const [endHour, endMinute] = workingHour.endTime.split(':').map(Number);

    while (
      startHour < endHour ||
      (startHour === endHour && startMinute < endMinute)
    ) {
      times.push(
        `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`
      );
      startMinute += 30;
      if (startMinute >= 60) {
        startHour += 1;
        startMinute = 0;
      }
    }

    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleClearDateTime = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    onDateTimeChange?.(null);
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
          value={selectedTime || ''}
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
          isDisabled={!selectedDate}
        >
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </Select>
      </Flex>

      {isOpen && (
        <Box position="absolute" top="100%" zIndex="10">
          <Calendar
            onChange={(value) => handleDateChange(value as Date)}
            value={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            tileDisabled={({ date }) =>
              disabledDates.includes(date.toISOString().split('T')[0])
            }
          />
        </Box>
      )}
    </Stack>
  );
}
