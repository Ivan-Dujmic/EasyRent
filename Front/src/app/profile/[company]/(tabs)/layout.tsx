'use client';

import { useState, useEffect } from 'react';
import DynamicTabs from '@/components/shared/profile/company/DynamicTabs';
import { usePathname } from 'next/navigation';
import { Flex, VStack } from '@chakra-ui/react';
import CompanyProfileHeader from '@/components/shared/Header/HeaderCompany';

export default function CompanyTabsLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname();
    const company = pathname.split('/').filter(Boolean).at(-2);

    const tabs = [
        {
            label: 'Info',
            name: 'Info',
            href: `/profile/${company}/info`
        },
        {
            label: 'Vehicles',
            name: 'Vehicles',
            href: `/profile/${company}/vehicles`
        },
        {
            label: 'Offers',
            name: 'Offers',
            href: `/profile/${company}/offers`
        },
        {
            label: 'Log',
            name: 'Log',
            href: `/profile/${company}/log`
        },
        {
            label: 'Chats',
            name: 'Chats',
            href: `/profile/${company}/chats`
        },
        {
            label: 'Reviews',
            name: 'Reviews',
            href: `/profile/${company}/reviews`
        },
        {
            label: 'Earnings',
            name: 'Earnings',
            href: `/profile/${company}/earnings`
        },
    ];

    return (
        <VStack w="100%">
            <DynamicTabs tabs={tabs} />
            {children}
        </VStack>
    );
}
