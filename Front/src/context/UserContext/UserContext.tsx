'use client';

import { IUser } from '@/typings/users/user.type';
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

interface UserContextType {
  user: IUser;
  setUser: (user: IUser) => void;
}

// Kreiraj kontekst
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider komponenta
export const UserProvider = ({ children }: { children: React.ReactNode }) => {

  const [globalId, setGlobalId] = useState(0)

  function newId() : number {
    setGlobalId(globalId + 1)
    return globalId - 1
  }

  const [user, setUser] = useState<IUser>({ role: 'guest', user_id: newId() }); // Default vrijednost

  // Dohvati podatke pri inicijalizaciji komponente
  useEffect(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Ako korisnik ne postoji u localStorage, možemo ga dohvatiti s API-ja
          fetch('/api/user') // Primjer API poziva
            .then((res) => res.json())
            .then((data) => {
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            })
            .catch(() => {
              console.error('Failed to fetch user data');
            });
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    } else {
      // Ukoliko localStorage nije dostupan, možeš po potrebi odraditi neku drugu logiku
      // npr. samo fetch s /api/user ili ostaviti default guest user
      console.log(
        'localStorage nije dostupan - radi se SSR ili je blokiran pristup.'
      );
    }
  }, []);

  // Kad god se podaci o korisniku promijene, ažuriraj localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
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
