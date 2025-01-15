import { Flex, Heading } from '@chakra-ui/react';
import { IoCarSport } from 'react-icons/io5';
import NextLink from 'next/link';

export default function EasyRentLogo() {
  return (
    <Heading size="lg" color={'brandblue'} as={NextLink} href="/home">
      {' '}
      {/*Za sad aenka bude ovkao kansije cu trebati mlao prilagoditi, neki interface ili nesto*/}
      <Flex align={'flex-end'} gap={2}>
        EasyRent
        <IoCarSport />
      </Flex>
    </Heading>
  );
}
