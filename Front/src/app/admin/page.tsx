'use client';

import { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    window.location.href = 'https://easyrent-t7he.onrender.com/admin';
  }, []);

  return null;
}
