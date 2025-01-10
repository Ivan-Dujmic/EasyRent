import { Flex, IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function CardMenuDot ({ children }: { children: React.ReactNode }) {
    return (
        <Flex
          position="absolute"
          top="8px"
          right="8px"
          zIndex={10}
          onClick={(e) => e.preventDefault()} // Prevent the menu from propagating the event
        >
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BsThreeDotsVertical />}
              size="sm"
              variant="ghost"
              aria-label="Options"
            />
            <MenuList p="0" fontSize="x-small">
              {children}
            </MenuList>
          </Menu>
        </Flex>
    )
}