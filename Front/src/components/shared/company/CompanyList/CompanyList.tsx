import {
  Card,
  CardBody,
  Image,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';

export default function CompanyList({ companies }: { companies: Company[] }) {
  const imageSize = useBreakpointValue({
    base: '25px', // Small gap for small screens (mobile)
    md: '28px', // Slightly larger gap for medium screens (laptop/tablet)
    lg: '30px', // Largest gap for large screens (desktop)
    xl: '35px',
  });

  return (
    <Flex wrap="wrap" gap={3} justify="start">
      {companies.map((company, index) => (
        <Card
          key={index}
          direction="row"
          overflow="hidden"
          variant="outline"
          boxShadow="none"
          border="none"
          p={1}
        >
          <CardBody
            p={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              objectFit="contain"
              width="auto"
              height={imageSize}
              src={company.logo}
              alt={`${company.name} logo`}
            />
          </CardBody>
        </Card>
      ))}
    </Flex>
  );
}
