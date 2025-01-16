import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Heading,
  Flex,
  List,
  ListItem,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

export default function FQA() {
  const containerWidth = useBreakpointValue({
    base: '80vw', // For smaller screens (e.g., phones)
    md: '60vw', // For medium and larger screens
  });

  return (
    <Flex direction="column" align="center" width={containerWidth} gap={7}>
      <Heading size="md" color="brandblack" alignSelf="flex-start">
        Everything You Need to Know:
      </Heading>
      <Flex
        direction={'row'}
        align={'flex-start'}
        justify={'space-between'}
        gap={5}
        wrap={['wrap', 'wrap', 'wrap', 'nowrap']}
        width={'100%'}
      >
        {/* First Accordion */}
        <Accordion allowToggle flexBasis={['100%', '100%', '100%', '48%']}>
          {/* item 1.1 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Why book with EasyRent.com in Croatia?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                We make it easy to find the perfect rental car to suit your
                needs. Here&apos;s what we offer:
              </Text>
              <List spacing={2} pl={5} styleType="disc">
                <ListItem>
                  Wide selection of vehicles &ndash; from compact cars to SUVs
                </ListItem>
                <ListItem>Support in over 30 languages</ListItem>
                <ListItem>
                  Free cancellation up to 48 hours before pickup for most
                  reservations
                </ListItem>
              </List>
              <Text mt={3}>
                <strong>Note:</strong> Please read the rental conditions
                carefully as they may vary by car rental company. For instance,
                additional identification might be required, or some companies
                might not accept certain payment methods.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 1.2 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  What do I need to rent a car?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                You need a credit or debit card to book a car. At the counter,
                you will need:
              </Text>
              <List spacing={2} pl={5} styleType="disc">
                <ListItem>Passport</ListItem>
                <ListItem>Voucher</ListItem>
                <ListItem>Driver&apos;s license of each driver</ListItem>
                <ListItem>
                  The main driver&apos;s credit card (some car rental companies
                  accept debit cards, but most do not)
                </ListItem>
              </List>
              <Text mt={3}>
                <strong>Note:</strong> Please also check the car rental
                conditions as each car rental company has its own conditions.
                For example, you may need additional identification, they may
                not accept certain credit cards, or they may not want to rent a
                car to a driver who has not held a driver&apos;s license for at
                least 36 months.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 1.3 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  What is the cost of a weekly car rental in Croatia?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text>
                Based on the average daily rental cost of &euro;46, the price
                for a week would be approximately &euro;322 when booking through
                our site.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 1.4 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  What is the cost of a monthly car rental in Croatia?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text>
                Based on the average daily rental cost of &euro;46, the price
                for a month would be approximately &euro;1,380 when booking
                through our site.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 1.5 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Am I old enough to rent a car?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text>
                Most companies will rent you a car if you are at least 21 years
                old, although some might not rent to younger drivers. However,
                if you are under 25, you might need to pay a &quot;young driver
                fee.&quot;
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 1.6 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  What type of car do most users rent in Croatia?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text>
                Medium-sized cars are the most popular category among our users
                in Croatia, followed by smaller cars and premium vehicles.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 1.7 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  How to choose the right car?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <List spacing={2} pl={5} styleType="disc">
                <ListItem>
                  Consider your destination. An SUV might be perfect for driving
                  on highways in Texas, but in Rome, a smaller car would be a
                  better choice.
                </ListItem>
                <ListItem>
                  Check reviews from other users. On our website, you can find
                  numerous reviews and ratings to see what other customers liked
                  or didn&apos;t like about certain car rental companies.
                </ListItem>
                <ListItem>
                  Don&apos;t forget about the transmission. In some countries,
                  cars with manual transmission are standard, while in others,
                  automatic cars are more common. Rent a car you are comfortable
                  driving!
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Second Accordion */}
        <Accordion allowToggle flexBasis={['100%', '100%', '100%', '48%']}>
          {/* item 2.1 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Pick up and return at different locations?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                It is usually possible to return a rental car at a different
                location, but it depends on each company&apos;s rules and might
                involve an extra fee.
              </Text>
              <Text>
                The most popular companies in Croatia allowing one-way rentals
                are Alamo, Avis, and Enterprise.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 2.2 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  When to book in advance?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text>
                13% of our users book last-minute car rentals at an average
                daily cost of &euro;57. However, the best time to book is 3
                months before your trip, as the average cost drops to &euro;34
                per day.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 2.3 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Are all costs included in the rental price?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                The displayed price includes the car, basic insurance (e.g.,
                theft protection or collision damage waiver (CDW)), and any
                fees, if applicable, that you typically pay upon pick-up (e.g.,
                one-way rental fee, airport fee, and local taxes).
              </Text>
              <Text mb={3}>
                It also includes any additional services you have selected, such
                as GPS devices or child seats.
              </Text>
              <Text>
                <strong>Note:</strong> Additional insurance purchased at the
                counter is not included. You can find a detailed price breakdown
                on the payment page.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 2.4 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Renting for others?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text>
                Yes, simply provide their details in the &quot;Driver
                Information&quot; section during the booking process.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          {/* item 2.5 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Rental companies in Croatia?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                Croatia offers a wide variety of car rental companies to suit
                your needs. Based on our reservations, here are some of the most
                popular options:
              </Text>
              <List spacing={2} pl={5} styleType="disc">
                <ListItem>Avantcar</ListItem>
                <ListItem>Carwiz</ListItem>
                <ListItem>Last Minute</ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>

          {/* item 2.6 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Cheapest rental companies?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                In the last 6 months, several companies have offered competitive
                prices in the &quot;medium-sized vehicle&quot; category on our
                platform. Below are some of the cheapest options:
              </Text>
              <List spacing={2} pl={5} styleType="disc">
                <ListItem>
                  <strong>Goldcar:</strong> Average daily price of &euro;28
                </ListItem>
                <ListItem>
                  <strong>Surprice:</strong> Average daily price of &euro;29
                </ListItem>
                <ListItem>
                  <strong>Greenmotion:</strong> Average daily price of &euro;31
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>

          {/* item 2.7 */}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Popular pick-up locations?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} fontSize={'0.8rem'}>
              <Text mb={3}>
                Many of our users prefer picking up rental cars at these popular
                locations in Croatia:
              </Text>
              <List spacing={2} pl={5} styleType="disc">
                <ListItem>Divulje</ListItem>
                <ListItem>Split Airport</ListItem>
                <ListItem>Močići</ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Flex>
  );
}
