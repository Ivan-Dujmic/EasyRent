import DateTimeDDM from '@/components/features/DropDownMenus/DateTimeDDM/DateTimeDDM';
import LocationDDM from '@/components/features/DropDownMenus/LocationDDM/LocationDDM';
import { Button, Flex, Box, useBreakpointValue } from '@chakra-ui/react';

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
  // Dodajemo podrazumevanu vrednost 'row' kada useBreakpointValue vrati undefined
  const flexDirection =
    useBreakpointValue<'row' | 'column'>({
      base: 'column', // Na manjim ekranima sve ide jedno ispod drugog
      md: 'row', // Na srednjim ekranima u dva reda
    }) || 'row'; // Podrazumevano 'row'

  const fieldWidth = useBreakpointValue({
    base: '100%', // Na manjim ekranima svaki element zauzima ceo red
    md: 'calc(50% - 1rem)', // Na srednjim ekranima dva elementa po redu
    xl: 'calc(20% - 1rem)', // Na velikim ekranima četiri elementa u jednom redu
  });

  const gap = useBreakpointValue({
    base: 2, // Manji razmak na malim ekranima
    md: 4, // Veći razmak na srednjim i velikim ekranima
  });

  return (
    <Flex
      direction={flexDirection} // Koristi fleksibilni raspored
      flexWrap={'wrap'}
      bg={'white'}
      width={'100%'}
      maxWidth={'60vw'}
      borderRadius={14}
      borderWidth="0px"
      align={'flex-end'}
      p={5}
      gap={gap}
      justifyContent={'space-between'}
    >
      {/* Lokacije */}
      <Box width={fieldWidth}>
        <LocationDDM
          options={options}
          description={'Pick-up location'}
          placeHolder={'From?'}
        />
      </Box>
      <Box width={fieldWidth}>
        <LocationDDM
          options={options}
          description={'Drop-off location'}
          placeHolder={'To?'}
        />
      </Box>

      {/* Datum i vreme */}
      <Box width={fieldWidth}>
        <DateTimeDDM
          options={{}}
          description={'Pick-up date/time'}
          placeHolder={'Start?'}
        />
      </Box>
      <Box width={fieldWidth}>
        <DateTimeDDM
          options={{}}
          description={'Drop-off date/time'}
          placeHolder={'End?'}
        />
      </Box>

      {/* Dugme za pretragu */}
      <Box width={fieldWidth} flex={1} mt={1}>
        <Button
          bg={'brandblue'}
          size="lg"
          color={'white'}
          _hover={{ bg: 'brandyellow', color: 'brandblack' }}
          width="100%" // Dugme uvek zauzima ceo red u svom kontejneru
        >
          Search
        </Button>
      </Box>
    </Flex>
  );
}
