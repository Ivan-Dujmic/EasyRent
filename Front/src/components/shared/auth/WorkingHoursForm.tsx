import {
  Box,
  Text,
  Flex,
  useColorModeValue,
  Heading,
  transition,
  VStack,
  FormControl,
  Input,
} from '@chakra-ui/react';

export default function WorkingHoursForm() {
  return (
    <VStack width={'full'} gap={0} alignItems={'end'}>
      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Mon
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>

      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Tue
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>

      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Wed
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>

      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Thu
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>

      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Fri
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>

      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Sat
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>

      <Flex
        justifyContent={'space-evenly'}
        alignItems={'center'}
        width={'full'}
      >
        <Text minWidth={"35px"} textAlign={'center'} m={2}>
          Sun
        </Text>
        <Input type="time" m={2} />
        <Input type="time" m={2} />
      </Flex>
    </VStack>
  );
}
