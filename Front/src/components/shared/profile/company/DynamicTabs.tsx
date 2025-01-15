import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabIndicator,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

interface ITab {
  tabs: { name: string; href: string }[];
}

export default function DynamicTabs({ tabs }: ITab) {
  const pathname = usePathname();
  const activeTab = pathname.split('/').filter(Boolean).pop();
  const activeTabIndex = tabs.findIndex((tab) => tab.name.toLowerCase() === activeTab?.toLowerCase());

  return (
    <Tabs
      variant="unstyled"
      w="100%"
      index={activeTabIndex}
      mb="10px"
    >
      <TabList justifyContent="center" position="relative">
        {tabs.map((tab, index) => (
          <Tab
            as="a" 
            key={index}
            href={tab.href} 
            borderBottom='2px solid'
            borderColor='brandlightgray'
            _selected={{
              color: 'brandblue',
              fontWeight: 'bold',
              borderBottom: '2px solid',
              borderColor: 'brandblue'
            }}
            _hover={{ bg: 'brandlightgray' }} 
            _focus={{ outline: 'none',
                      shadow: 'none'
             }}   
          >
            {tab.name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
