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
    >
      <TabList justifyContent="center">
        {tabs.map((tab, index) => (
          <Tab
            as="a" 
            key={index}
            href={tab.href} 
            _selected={{
              color: 'brandblue',
              fontWeight: 'bold',
            }}
            _hover={{ bg: 'brandlightgray' }} 
            _focus={{ outline: 'none',
                      shadow: 'none'
             }}   
            _active={{ bg: 'transparent' }}
          >
            {tab.name}
          </Tab>
        ))}
      </TabList>

      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="brandblue"
        borderRadius="1px"
      />
    </Tabs>
  );
}
