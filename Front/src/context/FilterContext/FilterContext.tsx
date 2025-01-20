'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Funkcija koja provjerava je li localStorage dostupan
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

// Definiraj strukturu podataka
export interface FilterData {
  pick_up_location: string;
  drop_off_location: string;
  pick_up_date: string | null; // Datum u DD-MM-YYYY formatu
  pick_up_time: string | null; // Vrijeme u HH:MM:SS formatu
  drop_off_date: string | null; // Datum u DD-MM-YYYY formatu
  drop_off_time: string | null; // Vrijeme u HH:MM:SS formatu
}

interface FilterContextType {
  filterData: FilterData;
  setFilterData: (data: FilterData) => void;
  resetFilterData: () => void;
}

// Kreiraj kontekst
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider komponenta
export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterData, setFilterData] = useState<FilterData>({
    pick_up_location: '',
    drop_off_location: '',
    pick_up_date: null,
    pick_up_time: null,
    drop_off_date: null,
    drop_off_time: null,
  });

  // Dohvati podatke iz localStorage pri inicijalizaciji
  useEffect(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      try {
        const savedFilterData = localStorage.getItem('filterData');
        if (savedFilterData) {
          setFilterData(JSON.parse(savedFilterData));
        }
      } catch (error) {
        console.error('Greška pri čitanju filterData iz localStorage:', error);
      }
    }
  }, []);

  // Spremi podatke u localStorage kad god se `filterData` promijeni
  useEffect(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      try {
        localStorage.setItem('filterData', JSON.stringify(filterData));
      } catch (error) {
        console.error('Greška pri spremanju filterData u localStorage:', error);
      }
    }
  }, [filterData]);

  // Resetiraj podatke u default vrijednosti
  const resetFilterData = () => {
    const defaultData: FilterData = {
      pick_up_location: '',
      drop_off_location: '',
      pick_up_date: null,
      pick_up_time: null,
      drop_off_date: null,
      drop_off_time: null,
    };
    setFilterData(defaultData);
  };

  return (
    <FilterContext.Provider
      value={{ filterData, setFilterData, resetFilterData }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Hook za lakši pristup kontekstu
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      'useFilterContext mora biti korišten unutar FilterProvider-a'
    );
  }
  return context;
};
