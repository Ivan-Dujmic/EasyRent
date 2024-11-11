import { Box, Flex, Text, Link } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      as="footer"
      width="100%"
      bg="brandgray"
      color="brandwhite"
      py={4}
      height={'70px'}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        justify="space-between"
        align="center"
        direction="column"
        textAlign="center"
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} Created by{' '}
          <Link
            href="https://github.com/fran-galic/EasyRent"
            isExternal
            color="brandblue"
          >
            EasyRent(G16.2)
          </Link>
          . All rights reserved.
        </Text>
        <Flex gap={4} mt={{ base: 2, md: 0 }}>
          <Link
            href="/https://github.com/fran-galic/EasyRent/blob/main/LICENSE"
            color="brandblue"
            fontSize="sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/https://github.com/fran-galic/EasyRent/blob/main/LICENSE"
            color="brandblue"
            fontSize="sm"
          >
            Terms of Service
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
