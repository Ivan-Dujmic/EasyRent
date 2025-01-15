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
  const [user, setUser] = useState<User>({ role: 'guest' }); // Default vrijednost

  // Dohvati podatke pri inicijalizaciji komponente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser)); // Postavi korisnika iz localStorage
      } else {
        // Možeš ovdje pozvati API ako želiš dohvatiti podatke s backend-a
        fetch('/api/user') // Primjer API poziva
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data)); // Spremi podatke u localStorage
          })
          .catch(() => {
            console.error('Failed to fetch user data');
          });
      }
    }
  }, []); // Pokreće se samo jednom nakon montaže komponente

  // Kad god se podaci o korisniku promijene, ažuriraj localStorage
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
