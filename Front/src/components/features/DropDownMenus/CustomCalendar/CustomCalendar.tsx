'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, CalendarProps } from 'react-calendar';
import { Box, Select, Text, Stack } from '@chakra-ui/react';
import 'react-calendar/dist/Calendar.css';
import './custom-calendar-booking.css';

/** Interfejsi koje očekujemo */
interface Interval {
  dateTimeRented: string; // npr. "2025-01-21T16:52:11.243Z"
  dateTimeReturned: string; // npr. "2025-01-22T10:15:00.000Z"
}

interface WorkingHour {
  /** 0 = Ponedjeljak, 1 = Utorak, …, 6 = Nedjelja */
  dayOfTheWeek: number;
  startTime: string; // npr. "09:00:00"
  endTime: string; // npr. "17:00:00"
}

interface CustomCalendarProps {
  /** Intervali u kojima je vozilo rezervirano (nedostupno) */
  intervals: Interval[];
  /** Radni sati po danima u tjednu */
  workingHours: WorkingHour[];
  /** Callback: vraća finalno odabran datum i vrijeme ili null */
  onDateTimeSelect?: (selectedDateTime: Date | null) => void;
}

/** Pomoćna: konvertira "HH:MM:SS" u broj sati/minuta. */
function parseTimeString(timeString: string) {
  const [h, m] = timeString.split(':');
  return { hours: parseInt(h, 10), minutes: parseInt(m, 10) };
}

/** Pomoćna: vraća datum u 00:00 za usporedbu */
function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** JavaScript default: getDay() → 0=Sunday, 1=Monday, ...  
    Ovom transformacijom dobijemo: 0=Ponedjeljak, 1=Utorak, ..., 6=Nedjelja. */
function getCalendarDayOfWeek(date: Date) {
  return (date.getDay() + 6) % 7;
}

/** Vraća true ako se dan preklapa s bilo kojim rezerviranim intervalom. */
function isDayReserved(date: Date, intervals: Interval[]) {
  const dayStart = startOfDay(date).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;

  return intervals.some((int) => {
    const rentedStart = new Date(int.dateTimeRented).getTime();
    const rentedEnd = new Date(int.dateTimeReturned).getTime();
    // Dva intervala [dayStart, dayEnd] i [rentedStart, rentedEnd] se preklapaju
    // ako je (dayStart <= rentedEnd) i (dayEnd >= rentedStart).
    return dayStart <= rentedEnd && dayEnd >= rentedStart;
  });
}

/** Vraća radne sate za određeni dan (ili null ako ih nema) */
function getWorkingHoursForDay(dayOfWeek: number, workingHours: WorkingHour[]) {
  return workingHours.find((wh) => wh.dayOfTheWeek === dayOfWeek) || null;
}

/** Generira (npr. u koracima od 30min) vremenske slotove unutar [startTime, endTime]. */
function buildTimeSlots(
  startH: number,
  startM: number,
  endH: number,
  endM: number,
  step = 30
) {
  const slots: string[] = [];
  let current = new Date(2000, 0, 1, startH, startM);
  const end = new Date(2000, 0, 1, endH, endM);

  while (current.getTime() <= end.getTime()) {
    const hh = String(current.getHours()).padStart(2, '0');
    const mm = String(current.getMinutes()).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + step);
  }
  return slots;
}

export default function CustomCalendar({
  intervals,
  workingHours,
  onDateTimeSelect,
}: CustomCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  /** Obrada pri odabiru datuma na kalendaru */
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime('');
      // Dok ne odaberemo i vrijeme, javljamo null
      onDateTimeSelect?.(null);
    }
  };

  /** Obrada pri odabiru vremena iz drop-downa */
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);

    if (selectedDate && newTime) {
      const [hh, mm] = newTime.split(':').map(Number);
      const finalDateTime = new Date(selectedDate);
      finalDateTime.setHours(hh, mm, 0, 0);

      onDateTimeSelect?.(finalDateTime);
    } else {
      onDateTimeSelect?.(null);
    }
  };

  /** Generiramo listu vremena (slotova) za trenutno odabrani dan */
  const validTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dayIndex = getCalendarDayOfWeek(selectedDate);
    const wh = getWorkingHoursForDay(dayIndex, workingHours);
    if (!wh) return []; // zatvoreni smo taj dan
    const { hours: startH, minutes: startM } = parseTimeString(wh.startTime);
    const { hours: endH, minutes: endM } = parseTimeString(wh.endTime);

    return buildTimeSlots(startH, startM, endH, endM, 30);
  }, [selectedDate, workingHours]);

  /** Funkcija koja onemogućuje biranje datuma na kalendaru */
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;

    // 1) Datum u prošlosti
    if (startOfDay(date).getTime() < startOfDay(new Date()).getTime()) {
      return true;
    }

    // 2) Datum se preklapa s rezerviranim intervalom
    if (isDayReserved(date, intervals)) {
      return true;
    }

    // 3) Provjera radnih sati (ako ne postoji zapis, zatvoreni smo taj dan)
    const dayIndex = getCalendarDayOfWeek(date);
    const wh = getWorkingHoursForDay(dayIndex, workingHours);
    if (!wh) {
      return true;
    }

    return false;
  };

  const clearSelection = () => {
    setSelectedDate(null);
    setSelectedTime('');
    onDateTimeSelect?.(null);
  };

  return (
    <Stack spacing={4}>
      <Text fontWeight="bold">CustomCalendar - Primjer</Text>

      {/* Kalendar */}
      <Box>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileDisabled={tileDisabled}
        />
      </Box>

      {/* Odabir vremena (samo ako je datum omogućeno izabran) */}
      {selectedDate && (
        <Select
          placeholder="Odaberite vrijeme"
          value={selectedTime}
          onChange={handleTimeChange}
          mt={2}
        >
          {validTimeSlots.length === 0 && (
            <option disabled>Nema radnih sati za ovaj dan</option>
          )}
          {validTimeSlots.map((timeSlot) => (
            <option key={timeSlot} value={timeSlot}>
              {timeSlot}
            </option>
          ))}
        </Select>
      )}

      {/* Prikaz što je trenutno izabrano */}
      {selectedDate && (
        <Box color="gray.600" mt={2}>
          <Text>Odabrani datum: {selectedDate.toLocaleDateString()}</Text>
          {selectedTime && <Text>Odabrano vrijeme: {selectedTime}</Text>}
        </Box>
      )}

      <button onClick={clearSelection}>Očisti odabir</button>
    </Stack>
  );
}
