import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';

interface FQAAccordionItemInput {
  title: string;
  body: string;
}

export default function FQAAccordionItem({
  title,
  body,
}: FQAAccordionItemInput) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{body}</AccordionPanel>
    </AccordionItem>
  );
}
