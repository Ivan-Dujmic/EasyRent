'use client';

import React, { createContext, useContext, useState } from 'react';

// Definišite tipove za podatke o korisniku
export interface User {
  role: 'guest' | 'user' | 'company' | 'admin';
  firstName?: string;
  lastName?: string;
  balance?: number;
  companyName?: string;
}

interface UserContextProps {
  user: User;
  setUser: (user: User) => void; // Funkcija za ažuriranje podataka o korisniku
}

// Kreirajte kontekst
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Provider za upravljanje podacima o korisniku
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({ role: 'guest' }); // Default vrednost: guest

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook za pristup UserContext-u
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
