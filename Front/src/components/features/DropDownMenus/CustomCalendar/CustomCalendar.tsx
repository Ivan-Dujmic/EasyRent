'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flex,
  Box,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Select,
  useOutsideClick,
} from '@chakra-ui/react';
import { CalendarIcon, CloseIcon } from '@chakra-ui/icons';
import Calendar, { CalendarProps } from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import './custom-calendar-booking.css'; // Tvoj CSS za kalendar

/** Definicije tipova za intervale i radne sate */
export interface Interval {
  dateTimeRented: string;
  dateTimeReturned: string;
}

export interface WorkingHour {
  /** 0=Ponedjeljak, 1=Utorak, …, 6=Nedjelja */
  dayOfTheWeek: number;
  startTime: string; // "09:00:00"
  endTime: string; // "17:00:00"
}

interface PickupDateTimeProps {
  pickupLabel?: string; // "Pick-up date"
  pickupTimeLabel?: string; // "Pick-up time"
  placeholderDate?: string; // npr. "dd.mm.gggg." ili "Pick a Date"
  placeholderTime?: string; // npr. "--:--" ili "Select Time"

  /** Minimalni datum (ako želimo spriječiti prošle datume) */
  minDate?: Date;
  /** Maksimalni datum */
  maxDate?: Date;
  /** Minimalno vrijeme (npr. "09:00") ako želimo zabraniti ranije slotove */
  minTime?: string;

  /** Početni datum i vrijeme */
  initialDateTime?: Date | null;
  /** Intervali koji onemogućuju dane (rezervacije) */
  intervals?: Interval[];
  /** Radni sati (ako undefined ili prazan, sve onemogućeno) */
  workingHours?: WorkingHour[];
  /** Kad god se promijeni datum/vrijeme ili se briše, javimo roditelju */
  onDateTimeChange?: (dateTime: Date | null) => void;
  isDisabled?: boolean;
  pickupLocationId?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffLocationId?: string;
}

/* --- Pomoćne funkcije za rad s vremenom i radnim satima --- */
function parseTimeString(timeString: string) {
  const [h, m] = timeString.split(':');
  return { hours: parseInt(h, 10), minutes: parseInt(m, 10) };
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** JS default: getDay() => 0=Sunday, 1=Monday, ... 
    Transformiramo tako da 0=Ponedjeljak, 6=Nedjelja */
function getCalendarDayOfWeek(date: Date) {
  return (date.getDay() + 6) % 7;
}

/** Dan je 'reserved' ako se preklapa s bilo kojim intervalom. */
function isDayReserved(date: Date, intervals?: Interval[]) {
  if (!intervals || intervals.length === 0) return false;
  const dayStart = startOfDay(date).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;

  return intervals.some((int) => {
    const rentedStart = new Date(int.dateTimeRented).getTime();
    const rentedEnd = new Date(int.dateTimeReturned).getTime();
    // interval [dayStart, dayEnd] preklapa [rentedStart, rentedEnd]?
    return dayStart <= rentedEnd && dayEnd >= rentedStart;
  });
}

function getWorkingHoursForDay(
  dayOfWeek: number,
  workingHours?: WorkingHour[]
) {
  if (!workingHours || workingHours.length === 0) {
    return null; // zatvoreno svaki dan
  }
  return workingHours.find((wh) => wh.dayOfTheWeek === dayOfWeek) || null;
}

/** Generira satne slotove [startTime, endTime]. */
function buildTimeSlots(
  startH: number,
  startM: number,
  endH: number,
  endM: number,
  step = 60 // Promjena koraka na 60 minuta za pune sate
) {
  const slots: string[] = [];
  let current = new Date(2000, 0, 1, startH, 0); // Postavi minute na 0
  const end = new Date(2000, 0, 1, endH, 0); // Postavi end minute na 0

  while (current.getTime() <= end.getTime()) {
    const hh = String(current.getHours()).padStart(2, '0');
    slots.push(`${hh}:00`); // Samo puni sat
    current.setHours(current.getHours() + 1); // Dodaj 1 sat umjesto minuta
  }
  return slots;
}

export default function CustomCalendar({
  pickupLabel = 'Pick-up date',
  pickupTimeLabel = 'Pick-up time',
  placeholderDate = 'Pick a Date',
  placeholderTime = 'Select Time',

  minDate,
  maxDate,
  minTime,
  initialDateTime = null,
  intervals,
  workingHours,
  onDateTimeChange,
  isDisabled,
  pickupLocationId,
  pickupDate,
  pickupTime,
  dropoffLocationId,
}: PickupDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Radi "debounce" pri odabiru vremena
  const updateRef = useRef(false);
  // Referenca za klik izvan kalendara
  const calendarRef = useRef<HTMLDivElement | null>(null);

  /* Klik izvan -> zatvaramo kalendar */
  useOutsideClick({
    ref: calendarRef,
    handler: () => setIsCalendarOpen(false),
  });

  /* Ako je postavljen initialDateTime, namjesti state. */
  useEffect(() => {
    if (initialDateTime) {
      const initDate = new Date(initialDateTime);
      setSelectedDate(initDate);
      const hh = String(initDate.getHours()).padStart(2, '0');
      const mm = String(initDate.getMinutes()).padStart(2, '0');
      setSelectedTime(`${hh}:${mm}`);
    }
  }, [initialDateTime]);

  /* Kad user odabere dan na kalendaru */
  const handleCalendarDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);

      if (selectedTime) {
        // ako već ima odabran sat, kombiniraj
        const [h, m] = selectedTime.split(':').map(Number);
        const newDate = new Date(value);
        newDate.setHours(h, m, 0, 0);
        onDateTimeChange?.(newDate);
      }
      setIsCalendarOpen(false);
    }
  };

  /** Generiramo validne time slotove za odabrani dan (ovisno o radnim satima). */
  const validTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    if (!workingHours || workingHours.length === 0) return [];

    const dayIndex = getCalendarDayOfWeek(selectedDate);
    const wh = getWorkingHoursForDay(dayIndex, workingHours);
    if (!wh) return [];

    const { hours: startH, minutes: startM } = parseTimeString(wh.startTime);
    const { hours: endH, minutes: endM } = parseTimeString(wh.endTime);

    return buildTimeSlots(startH, startM, endH, endM, 30);
  }, [selectedDate, workingHours]);

  /** Odabir vremena iz dropdowna */
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime || null);

    if (newTime && selectedDate) {
      const [hh, mm] = newTime.split(':').map(Number);
      const finalDateTime = new Date(selectedDate);
      finalDateTime.setHours(hh, mm, 0, 0);

      if (!updateRef.current) {
        updateRef.current = true;
        onDateTimeChange?.(finalDateTime);
        setTimeout(() => (updateRef.current = false), 100);
      }
    } else {
      // ili je obrisano vrijeme ili nema datuma
      onDateTimeChange?.(null);
    }
  };

  /** Očisti sve (X gumb) */
  const handleClear = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    onDateTimeChange?.(null);
  };

  /** tileDisabled -> onemogući dane izvan min/max, prošlost, rezervacije, neradne dane */
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;

    // 1) Datum u prošlosti
    if (startOfDay(date).getTime() < startOfDay(new Date()).getTime()) {
      return true;
    }
    // 2) minDate / maxDate
    if (minDate && date < startOfDay(minDate)) return true;
    if (maxDate && date > startOfDay(maxDate)) return true;

    // 3) Rezervirano
    if (isDayReserved(date, intervals)) {
      return true;
    }
    // 4) Ako nema radnih sati => sve zatvoreno
    if (!workingHours || workingHours.length === 0) {
      return true;
    }
    // 5) Ako za taj dan nije definirano radno vrijeme
    const dayIndex = getCalendarDayOfWeek(date);
    const wh = getWorkingHoursForDay(dayIndex, workingHours);
    if (!wh) {
      return true;
    }

    return false;
  };

  /** Je li pojedini slot onemogućen zbog minTime? */
  const isTimeDisabled = (slot: string) => {
    if (!minTime) return false;
    const [minH, minM] = minTime.split(':').map(Number);
    const [curH, curM] = slot.split(':').map(Number);
    // Onemogući ako je ispod minTime
    return curH < minH || (curH === minH && curM < minM);
  };

  // trebalo bi ponisiti vrijednosti unutra svaki put kada se odaber eneka druga loakcija
  useEffect(() => {
    // Ako imaš neku početnu vrijednost (initialDateTime) i želiš je opet primijeniti:
    if (initialDateTime) {
      const initDate = new Date(initialDateTime);
      setSelectedDate(initDate);
      const hh = String(initDate.getHours()).padStart(2, '0');
      const mm = String(initDate.getMinutes()).padStart(2, '0');
      setSelectedTime(`${hh}:${mm}`);
    } else {
      // Inače postavi sve na null
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [
    intervals,
    workingHours,
    initialDateTime,
    pickupLocationId,
    pickupDate,
    pickupTime,
    dropoffLocationId,
  ]);

  return (
    <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
      {/* Lijevi Box -> PICKUP DATE */}
      <Box flex="1">
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          {pickupLabel}
        </Text>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <CalendarIcon color="brandblack" />
          </InputLeftElement>
          <Input
            placeholder={placeholderDate}
            readOnly
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            value={selectedDate ? selectedDate.toLocaleDateString() : ''}
            borderColor="brandblue"
            borderWidth="2px"
            borderRadius="md"
            _focusWithin={{ bg: 'brandwhite', borderColor: 'brandblack' }}
            isDisabled={isDisabled}
          />
          {(selectedDate || selectedTime) && (
            <InputRightElement>
              <IconButton
                size="sm"
                aria-label="Clear"
                icon={<CloseIcon />}
                onClick={handleClear}
              />
            </InputRightElement>
          )}
        </InputGroup>

        {isCalendarOpen && (
          <Box
            ref={calendarRef}
            position="absolute"
            bg="white"
            mt={2}
            p={2}
            boxShadow="lg"
            borderRadius="md"
            zIndex={10}
          >
            <Calendar
              onChange={handleCalendarDateChange}
              value={selectedDate}
              locale="hr-HR"
              calendarType="iso8601"
              tileDisabled={tileDisabled}
            />
          </Box>
        )}
      </Box>

      {/* Desni Box -> PICKUP TIME */}
      <Box flex="1">
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          {pickupTimeLabel}
        </Text>
        <Select
          placeholder={placeholderTime}
          value={selectedTime || ''}
          onChange={handleTimeChange}
          borderColor="brandblue"
          borderWidth="2px"
          borderRadius="md"
          _focusWithin={{ bg: 'brandwhite', borderColor: 'brandblack' }}
          isDisabled={isDisabled}
        >
          {validTimeSlots.length === 0 && <option disabled>--:--</option>}
          {validTimeSlots.map((slot) => (
            <option key={slot} value={slot} disabled={isTimeDisabled(slot)}>
              {slot}
            </option>
          ))}
        </Select>
      </Box>
    </Flex>
  );
}
