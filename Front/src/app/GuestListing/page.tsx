'use client';

import { useCarContext } from '@/context/CarContext';
import { Box, Text, Image, Flex } from '@chakra-ui/react';

export default function ResultsPage() {
  const { cars } = useCarContext();

  if (!cars) {
    return <Text>No results found.</Text>;
  }

  return (
    <Flex direction="column" gap={4}>
      {cars.map((car, index) => (
        <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
          <Image src={car.image} alt={car.modelName} />
          <Text>{car.companyName}</Text>
          <Text>
            {car.makeName} {car.modelName}
          </Text>
          <Text>{car.noOfSeats} seats</Text>
          <Text>{car.automatic ? 'Automatic' : 'Manual'}</Text>
          <Text>Price: {car.price}</Text>
          <Text>Rating: {car.rating}</Text>
        </Box>
      ))}
    </Flex>
  );
}
