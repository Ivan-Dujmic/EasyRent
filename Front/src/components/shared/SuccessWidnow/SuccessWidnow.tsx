import { CheckCircleIcon } from '@chakra-ui/icons';
import { Box, BoxProps, Button, Heading, Icon, Text, VStack } from '@chakra-ui/react';

interface SuccessWindowProps extends BoxProps {
  title?: string,
  text?: string,
  returnPage?: {name: string, link: string}
}

export default function SuccessWindow({
  title = "Application Received! 🎉",
  text = `Thank you for applying. Please check your email to verify your
            account. Once your account is verified, you’ll be able to log in and
            start exploring.`,
  returnPage = {name: "Jump to Login", link: "/login"},
  children=undefined,
  bg="brandGray",
  w="100%",
  maxW="600px",
  margin="0 auto",
  mt=10,
  p=6,
  borderRadius="md",
  boxShadow="0 0 15px rgba(0, 0, 0, 0.2)",
  textAlign="center",
  ...rest
}: SuccessWindowProps) {
  return (
    <Box
      bg={bg}
      w={w}
      maxW={maxW}
      margin={margin}
      mt={mt}
      p={p}
      borderRadius={borderRadius}
      boxShadow={boxShadow}
      textAlign={textAlign}
      {...rest}
    >
      <VStack spacing={4}>
        {!children && (
          <Icon as={CheckCircleIcon} w={10} h={10} color="brandyellow" />
        )}
        <Heading as="h2" color="brandBlue" fontSize="2xl">
          {title}
        </Heading>
        {children || (
          <Text fontSize="lg" color="brandblack">
            {text}
          </Text>
        )}
          <Button
            bg={'brandblue'}
            color={'brandwhite'}
            fontWeight={'normal'}
            fontSize="md"
            size="md"
            _hover={{
              bg: 'brandblue',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease',
            }}
            as="a"
            href={returnPage?.link}
          >
            {returnPage?.name}
          </Button>
      </VStack>
    </Box>
  );
}
