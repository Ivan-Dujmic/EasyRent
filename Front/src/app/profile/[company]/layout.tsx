'use client';

import { useState, useEffect } from 'react';
import DynamicTabs from '@/components/shared/profile/company/DynamicTabs';
import { usePathname } from 'next/navigation';
import { Flex, VStack } from '@chakra-ui/react';
import CompanyProfileHeader from '@/components/shared/Header/HeaderCompany';

export default function CompanyProfileLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname();
    const company = pathname.split('/').filter(Boolean).at(-2);

    const tabs = [
        {
            name: 'Info',
            href: `/profile/${company}/info`
        },
        {
            name: 'Vehicles',
            href: `/profile/${company}/vehicles`
        },
        {
            name: 'Offers',
            href: `/profile/${company}/offers`
        },
        {
            name: 'Log',
            href: `/profile/${company}/log`
        },
        {
            name: 'Chats',
            href: `/profile/${company}/chats`
        },
        {
            name: 'Reviews',
            href: `/profile/${company}/reviews`
        },
        {
            name: 'Earnings',
            href: `/profile/${company}/earnings`
        },
    ];

    return (
        <VStack w="100%">
            <CompanyProfileHeader />
            <DynamicTabs tabs={tabs} />
            {children}
        </VStack>
    );
}
