'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Definiraj strukturu podataka
export interface User {
  role: string; // "guest", "user", "company", "admin"
  firstName?: string;
  lastName?: string;
  companyName?: string;
  balance?: number;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

// Kreiraj kontekst
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider komponenta
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      // Dohvati podatke iz localStorage ili postavi na default (guest)
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { role: 'guest' };
    }
    return { role: 'guest' }; // Default vrijednost za SSR okruženje
  });

  // Kad god se podaci o korisniku promijene, spremi ih u localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook za lakši pristup kontekstu
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext mora biti korišten unutar UserProvidera');
  }
  return context;
};
