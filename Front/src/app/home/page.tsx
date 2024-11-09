'use client';

import Header from '@/components/shared/Header/Header';
import { Divider, Flex } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Flex direction="column" grow={1}>
      {/* <AuthRedirect to="/login" condition="isLoggedOut" /> */}
      <Header />
    </Flex>
  );
}
