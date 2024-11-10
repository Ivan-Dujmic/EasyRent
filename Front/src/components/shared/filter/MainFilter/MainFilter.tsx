import FromDDM from '@/components/features/DropDownMenus/FromDDM/FromDDM';
import { Flex } from '@chakra-ui/react';

export default function MainFilter() {
  return (
    <Flex
      direction={'row'}
      bg={'white'}
      width={'60vw'}
      height={'200px'}
      borderRadius={14}
      borderColor={'none'}
      borderWidth="4px"
      align={'center'}
      p={5}
    >
      <FromDDM />
    </Flex>
  );
}
