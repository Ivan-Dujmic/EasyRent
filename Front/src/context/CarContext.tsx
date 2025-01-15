'use client';

import { ICar } from '@/fetchers/homeData';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface CarContextType {
  cars: ICar[] | null;
  setCars: (cars: ICar[]) => void;
}

// Kreiraj kontekst
const CarContext = createContext<CarContextType | undefined>(undefined);

// Provider za wrapanje aplikacije
export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCarsState] = useState<ICar[] | null>(() => {
    // Prilikom inicijalizacije pokušaj dohvatiti automobile iz localStorage
    const savedCars = localStorage.getItem('cars');
    return savedCars ? JSON.parse(savedCars) : null;
  });

  // Funkcija koja ažurira stanje i localStorage
  const setCars = (newCars: ICar[]) => {
    setCarsState(newCars);
    localStorage.setItem('cars', JSON.stringify(newCars)); // Spremi automobile u localStorage
  };

  useEffect(() => {
    // Ovdje možeš postaviti dodatnu logiku ako je potrebno pri učitavanju komponenti
  }, []);

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
