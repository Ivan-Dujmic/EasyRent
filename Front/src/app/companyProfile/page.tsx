'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const company = pathname.split('/').filter(Boolean).pop();
  

  useEffect(() => {
    router.push(`/profile/${company}/info`);
  });

  return null;
}
