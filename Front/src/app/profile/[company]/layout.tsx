'use client';

import { usePathname } from 'next/navigation';
import { Flex, VStack } from '@chakra-ui/react';
import CompanyProfileHeader from '@/components/shared/Header/HeaderCompany';

export default function CompanyProfileLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname();
    return (
        <VStack w="100%">
            <CompanyProfileHeader />
            {children}
        </VStack>
    );
}
