import { ILog } from '@/typings/logs/logs.type';
import { StarIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Box,
  Text,
  Image,
  Flex,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export default function LogCard({ log }: { log: ILog }) {
  return (
    <Card
      maxW="350px"
      minW="180px"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={'brandwhite'}
      bg={'brandwhite'}
      px={2}
      _hover={{
        borderColor: 'brandblack',
        transition: 'border-color 0.3s ease',
      }}
    >
      <Image
        src={`data:image/png;base64,${log.image}`} // mozda dodat onaj neki nastavak prije
        alt={`${log.modelName} car`}
        objectFit="cover"
        width="100%"
        height="110px" // Set a fixed height to make all images uniform
        borderRadius="md" // Optional: adds a nice rounded edge to the image
      />
      <CardBody px={0} py={2}>
        <Stack spacing={2} height={'100%'} justify={'space-between'}>
          <Flex direction={'column'}>
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Text fontSize="xs">
                {log.makeName} {log.modelName}
              </Text>
            </Flex>

            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Text fontSize="xs">
                {log.registration}
              </Text>
              <Text fontSize="xs">{log.firstName} {log.lastName}</Text>
            </Flex>
            <Text fontSize="xs">{log.dateTimePickup} - {log.dateTimeReturned}</Text>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}
