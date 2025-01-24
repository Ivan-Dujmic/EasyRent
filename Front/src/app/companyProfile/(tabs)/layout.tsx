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
    const tabs = [
        {
            label: 'Info',
            name: 'Info',
            href: `/companyProfile/info`
        },
        {
            label: 'Vehicles',
            name: 'Vehicles',
            href: `/companyProfile/vehicles`
        },
        {
            label: 'Offers',
            name: 'Offers',
            href: `/companyProfile/offers`
        },
        {
            label: 'Log',
            name: 'Log',
            href: `/companyProfile/log`
        },
        {
            label: 'Reviews',
            name: 'Reviews',
            href: `/companyProfile/reviews`
        },
        {
            label: 'Earnings',
            name: 'Earnings',
            href: `/companyProfile/earnings`
        },
    ];

    return (
        <VStack w="100%">
            <DynamicTabs tabs={tabs} />
            {children}
        </VStack>
    );
}
