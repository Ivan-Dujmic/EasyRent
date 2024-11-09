import { Flex, Heading } from '@chakra-ui/react';
import { IoCarSport } from 'react-icons/io5';

export default function EasyRentLogo() {
  return (
    <Heading size="lg" color={'blue'}>
      <Flex align={'flex-end'} gap={2}>
        EasyRent
        <IoCarSport />
      </Flex>
    </Heading>
  );
}
