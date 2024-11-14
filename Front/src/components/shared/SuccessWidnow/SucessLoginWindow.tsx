import { Box, Text, VStack } from '@chakra-ui/react';

export default function SucessLoginWindow() {
  return (
    <Box
      bg="brandGray"
      w="100%"
      maxW="600px"
      margin="0 auto"
      mt={10}
      p={6}
      borderRadius="md"
      boxShadow="0 0 15px rgba(0, 0, 0, 0.2)"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Text fontSize="lg" color="brandblack">
          You have successfully logged in! We are connecting you to your
          profile...
        </Text>
      </VStack>
    </Box>
  );
}
