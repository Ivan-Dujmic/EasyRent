import DateTimeDDM from '@/components/features/DropDownMenus/DateTimeDDM/DateTimeDDM';
import LocationDDM from '@/components/features/DropDownMenus/LocationDDM/LocationDDM';
import { Button, Flex, Input, InputGroup } from '@chakra-ui/react';

const options: { [key: string]: string[] } = {
  'Cities (including airports)': [
    'Zagreb, Croatia',
    'Sesvete, Croatia',
    'Velika Gorica, Croatia',
    'Samobor, Croatia',
    'Split, Croatia',
    'Rijeka, Croatia',
  ],
  Airports: [
    'Franjo Tuđman, ZAG, Zagreb, Croatia',
    'Split Airport, SPU, Split, Croatia',
    'Dubrovnik Airport, DBV, Dubrovnik, Croatia',
  ],
  'Train stations': [
    'Zagreb Central Station, Zagreb, Croatia',
    'Split Train Station, Split, Croatia',
    'Osijek Train Station, Osijek, Croatia',
    'Rijeka Train Station, Rijeka, Croatia',
  ],
};

export default function MainFilter() {
  return (
    <Flex
      direction={'row'}
      bg={'white'}
      width={'60vw'}
      height={'110px'}
      borderRadius={14}
      borderColor={'none'}
      borderWidth="0px"
      align={'center'}
      p={5}
      gap={7}
      pb={7}
    >
      <Flex gap={2}>
        <LocationDDM
          options={options}
          description={'Pick-up location'}
          placeHolder={'From?'}
        />
        <LocationDDM
          options={options}
          description={'Drop-of location'}
          placeHolder={'To?'}
        />
      </Flex>
      <Flex gap={2}>
        {/* placeholderi */}
        <DateTimeDDM
          options={{}}
          description={'Pick-up date/time'}
          placeHolder={'Start?'}
        />
        <DateTimeDDM
          options={{}}
          description={'Drop-off date/time'}
          placeHolder={'End?'}
        />
      </Flex>

      <Button
        bg={'brandblue'}
        mt={4}
        size="lg"
        ml={'auto'}
        color={'white'}
        _hover={{ bg: 'brandyellow', color: 'brandblack' }}
        alignSelf={'center'}
      >
        Search
      </Button>
    </Flex>
  );
}
