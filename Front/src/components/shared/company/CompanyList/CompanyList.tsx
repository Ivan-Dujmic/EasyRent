import { Card, CardBody, Image, Flex } from '@chakra-ui/react';

export default function CompanyList({ companies }: { companies: Company[] }) {
  return (
    <Flex wrap="nowrap" gap={3} justify="start">
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
              height="35px"
              src={company.logo}
              alt={`${company.name} logo`}
            />
          </CardBody>
        </Card>
      ))}
    </Flex>
  );
}
