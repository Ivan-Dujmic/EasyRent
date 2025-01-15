import { Vehicle } from '@/typings/vehicles/vehicles';
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
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  Divider,
  
} from '@chakra-ui/react';
import { IoPersonSharp } from 'react-icons/io5';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { TbAutomaticGearbox } from 'react-icons/tb';
import NextLink from 'next/link';
import { ICar } from '@/fetchers/homeData';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CardMenuDot from '../cardMenu/CardMenuDot';
import { useRouter } from 'next/navigation';

export default function OfferCard({ offer }: { offer: ICar }) {
  const router = useRouter();
  const [isDimmed, setIsDimmed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleHide = () => {
    setIsDimmed(!isDimmed);
  };
  const handleEdit = () => {
    router.push("profile/${company}/edit/offer")
  };
  const handleDelete = () => {
    setIsDimmed(!isDimmed);
  };

  return (
    <Card
      as={NextLink}
      href={`/offer/${offer.modelName}`}
      maxW="210px"
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      opacity={isDimmed ? 0.5 : 1}
    >
      {isHovered && (
        <CardMenuDot>
              <MenuItem onClick={handleEdit}>Edit offer</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
              <MenuItem onClick={handleHide}>Hide</MenuItem>
        </CardMenuDot>
      )}

      <Image
        src={`data:image/png;base64,${offer.image}`} // mozda dodat onaj neki nastavak prije
        alt={`${offer.modelName} car`}
        objectFit="cover"
        width="100%"
        height="110px" // Set a fixed height to make all images uniform
        borderRadius="md" // Optional: adds a nice rounded edge to the image
      />
      <Divider
        borderWidth="2px"
        borderColor="transparent"
        background="linear-gradient(to right, blue, lightblue)"
        height="1px"
      />
      <CardBody px={0} py={2}>
        <Stack spacing={2} height={'100%'} justify={'space-between'}>
          <Flex direction={'column'}>
            <Flex gap={1} align={'baseline'} justify={'space-between'}>
              <Heading size="xs" fontSize="sm">
                {offer.makeName} {offer.modelName}
              </Heading>
              <Text fontSize="xs">€{offer.price}/day</Text>
            </Flex>
            <Flex
              gap={'1px'}
              fontSize="xs"
              align="baseline"
              alignSelf="flex-end"
              ml={Number(offer.noOfReviews) > 99 ? 0 : 'auto'}
              mt="3px"
            >
              <StarIcon boxSize="3" />{' '}
              {/* Adjusts the star icon to be slightly smaller */}
              <Box>{offer.rating}</Box>
              <Text as="span">({offer.noOfReviews} reviews)</Text>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
}
