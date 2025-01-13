'use client';

import { ICar } from '@/fetchers/homeData';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CarContextType {
  cars: ICar[] | null;
  setCars: (cars: ICar[]) => void;
}

// Kreiraj kontekst
const CarContext = createContext<CarContextType | undefined>(undefined);

// Provider za wrapanje aplikacije
export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<ICar[] | null>(null);

  return (
    <CarContext.Provider value={{ cars, setCars }}>
      {children}
    </CarContext.Provider>
  );
};

// Custom hook za korištenje konteksta
export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};
