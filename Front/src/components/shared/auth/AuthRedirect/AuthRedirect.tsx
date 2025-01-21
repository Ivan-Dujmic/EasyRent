'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IAuthRedirectProps {
  to: string;
  condition: 'isLoggedIn' | 'isLoggedOut';
  RedIfRole?: 'company' | 'user';
}

export const AuthRedirect = ({
  to,
  condition,
  RedIfRole,
}: IAuthRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;

    if (!user && condition === 'isLoggedOut') {
      router.push(to);
    }
    if (user && condition === 'isLoggedIn') {
      // onemogucava da user pristupi kompaniji i kompanija useru
      if (user.role === 'user' && RedIfRole == 'user') {
        router.push('/YourHomePage');
      }
      if (user.role === 'company' && RedIfRole == 'company') {
        router.push('/CompanyHomePage');
      }

      if (!RedIfRole) {
        if (user.role === 'user') {
          router.push('/YourHomePage');
        } else if (user.role === 'company') {
          router.push('/CompanyHomePage');
        }
      }
    }
  }, [RedIfRole, condition, router, to]);

  return null;
};
