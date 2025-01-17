'use client';

import DynamicTabs from '@/components/shared/profile/company/DynamicTabs';
import { usePathname } from 'next/navigation';
import { Flex, VStack, Text, Heading } from '@chakra-ui/react';

export default function CompanyTabsLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname();
    const company = pathname.split('/').filter(Boolean).at(-2);

    const tabs = [
        {
            label: 'Information',
            name: 'info',
            href: `/profile/${company}/edit/info`
        },
        {
            label: 'Password',
            name: 'password',
            href: `/profile/${company}/edit/password`
        },
        {
            label: 'Location',
            name: 'location',
            href: `/profile/${company}/edit/location`
        },
        {
            label: 'Delete',
            name: 'delete',
            href: `/profile/${company}/edit/delete`
        },
    ];

    return (
        <>
            <Flex w="100%" justifyContent="center" alignItems="center" gap="5" mt="10px">
                <Heading fontSize="2xl" mb="10px">Edit profile:</Heading>
                <DynamicTabs tabs={tabs} />
            </Flex>
            {children}
        </>
    );
}
