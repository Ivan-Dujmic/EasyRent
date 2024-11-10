import LocationDDM from '@/components/features/DropDownMenus/LocationDDM/LocationDDM';
import { Flex } from '@chakra-ui/react';

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
      height={'200px'}
      borderRadius={14}
      borderColor={'none'}
      borderWidth="4px"
      align={'center'}
      p={2}
      gap={5}
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
    </Flex>
  );
}
